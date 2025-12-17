import express from "express";
import notesRoute from "./routes/notes.js"

const app = express();

//1. Add a global middleware
app.use((req, res, next)=>{
console.log("request recieved in this global middleware function")
next();
});


app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

//2. Throw an error using new Error
app.get("/simulate-error", (req, res)=>{
  throw new Error("Simulating a dummy error");                                                                
})


//3. Throw an error with route-specific middleware function
app.get("/crash", (req, res, next)=>{
  const alert = new Error("Dont access this function");
  alert.status = 500;// internal server error - bad coding.
  next(alert); // which can handle an error and make it look good
})


app.use("/notes",notesRoute);

//4. Route not found middleware function
app.use((req, res, next)=>{
  const error = new Error("We dont have that root in our api listings");
  error.status = 404;
  next(error);
});

//5. Error middleware function
app.use((err, req, res, next)=>{
   // Status code: 404, 500, 301...
   const statusCode = err.status || 500;
   //JSON response
   res.status(statusCode).json({
    error:{
      status: statusCode,
      message: err.message
    }
   })
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));