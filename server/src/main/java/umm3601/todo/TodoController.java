package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

  private static final String STATUS_KEY = "status";
  private static final String CATEGORY_KEY = "category";
  public static final Boolean booleanRegex = true;

  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(database, "todos", Todo.class);
  }

  /**
   * Get the single todo specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
    }
  }

  /**
   * Get a JSON response with a list of all the todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodos(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      Boolean status;
      if ("complete".equals((ctx.queryParam(STATUS_KEY)))){
        status = true;
      }
      else{
        status = false;
      }
      filters.add(eq(STATUS_KEY, status));
    }

    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(regex(CATEGORY_KEY,  Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
    }

    ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewTodo(Context ctx) {
    Todo newTodo = ctx.bodyValidator(Todo.class)
      .check(tod -> tod.owner != null && tod.owner.length() > 0) //Verify that the todo has a owner that is not blank
      .check(tod -> (tod.status == (true)) || (tod.status == (false))) // Verify that the provided status is a valid status
      .check(tod -> tod.body != null && tod.body.length() > 0) // Verify that the provided body is > 0
      .check(tod -> tod.category != null && tod.category.length() > 0) // Verify that the todo has a category that is not blank
      .get();

    todoCollection.insertOne(newTodo);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newTodo._id));
  }
}
