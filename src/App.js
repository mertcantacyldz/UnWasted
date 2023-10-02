import "./App.css";

function App() {
  return (
    <p>
      <form id="login" action="/login">
        <label for="username">Mail:</label>
        <input type="email" id="email" name="email" />
        <br />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <br />
        <input type="submit" value="Login" />
      </form>
      <form id="register" method="post" action="/register">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" />
        <br />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="lname" name="password" />
        <br />
        <br />
        <label for="email">Mail:</label>
        <input type="email" id="email" name="email" />
        <br />
        <br />
        <input type="submit" value="Register" />
      </form>
    </p>
  );
}

export default App;
