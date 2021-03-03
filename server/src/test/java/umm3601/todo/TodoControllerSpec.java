package umm3601.todo;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;


/**
* Tests the logic of the TodoController
*
* @throws IOException
*/
public class TodoControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private TodoController TodoController;

  private ObjectId fredsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> TodoDocuments = db.getCollection("todos");
    TodoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(
      new Document()
        .append("owner", "Thomas")
        .append("status", true)
        .append("body", "Hello I am Thomas")
        .append("category", "intros"));
    testTodos.add(
      new Document()
      .append("owner", "Sally")
      .append("status", false)
      .append("body", "Hello I am Sally")
      .append("category", "intros"));
    testTodos.add(
      new Document()
      .append("owner", "Ricky")
      .append("status", false)
      .append("body", "Need to take out the trash")
      .append("category", "chores"));

    fredsId = new ObjectId();
    Document fred =
      new Document()
        .append("_id", fredsId)
        .append("owner", "Fred")
        .append("status", false)
        .append("body", "Hey it's Fred!!!")
        .append("category", "youtube");


    TodoDocuments.insertMany(testTodos);
    TodoDocuments.insertOne(fred);

    TodoController = new TodoController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllTodos() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    TodoController.getTodos(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("todos").countDocuments(), JavalinJson.fromJson(result, Todo[].class).length);
  }

  @Test
  public void GetTodosByStatus() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("status=complete");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    TodoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(1, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals(true, todo.status); // Every todo should be true
    }
  }

  @Test
  public void GetTodosByStatusFalse() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("status=incomplete");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    TodoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(3, resultTodos.length); // There should be one todos returned
    for (Todo todo : resultTodos) {
      assertEquals(false, todo.status); // Every todo should be false
    }
  }

  @Test
  public void GetTodosByCategory() throws IOException {

    mockReq.setQueryString("category=intros");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    TodoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(2, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals("intros", todo.category);
    }
  }

  @Test
  public void GetTodosMultipleFilters() throws IOException {

    mockReq.setQueryString("category=intros&status=false");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    TodoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(1, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals("Sally", todo.owner);
      assertEquals("intros", todo.category);
    }
  }

  @Test
  public void GetTodoWithExistentId() throws IOException {

    String testID = fredsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", testID));
    TodoController.getTodo(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo resultTodo = JavalinJson.fromJson(result, Todo.class);

    assertEquals(resultTodo._id, fredsId.toHexString());
    assertEquals(resultTodo.owner, "Fred");
  }

  @Test
  public void GetTodoWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      TodoController.getTodo(ctx);
    });
  }

  @Test
  public void GetTodoWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      TodoController.getTodo(ctx);
    });
  }

  @Test
  public void AddTodo() throws IOException {

    String testNewTodo = "{"
      + "\"owner\": \"Test Todo\","
      + "\"status\": true,"
      + "\"body\": \"Test the tests.\","
      + "\"category\": \"software design\","
      + "}";

    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    TodoController.addNewTodo(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("todos").countDocuments(eq("_id", new ObjectId(id))));

    //verify todo was added to the database and the correct ID
    Document addedTodo = db.getCollection("todos").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedTodo);
    assertEquals("Test Todo", addedTodo.getString("owner"));
    assertEquals(true, addedTodo.getBoolean("status"));
    assertEquals("Test the tests.", addedTodo.getString("body"));
    assertEquals("software design", addedTodo.getString("category"));
  }
}
