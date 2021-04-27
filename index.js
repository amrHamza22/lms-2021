const express=require('express')
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
const data= require("./courses.json")
const student_data=require('./students.json')
const Joi = require("joi")

const fs = require("fs")
const len= Object.keys(data.course).length
const validation = (data) => {
    const code_format = /^[a-zA-Z]{3}[0-9]{3}$/;
    const schema = Joi.object({
      name: Joi.string().min(5).required(),
      code: Joi.string().pattern(new RegExp(code_format)).min(6).required(),
      description: Joi.string().max(200).optional(),
    })
    const { error } = schema.validate(data)
    return error
}

app.get('/api/courses/:id',(req,res) =>{
  const requested_course = data.course.find((c) => c.id === parseInt(req.params.id))
  if (!requested_course){
    return res.send("No Such Course")
  } 
  res.send(requested_course)
})
app.get('/api/courses/',(req,res) =>{
    res.send(data.course)
  })

app.post('/web/courses/create',(req,res) => {
    const err=validation(req.body)
    if (err){
        return res.send(err.details[0].message)
    }
    else{
        const course={
            "name":req.body.name,
            "code": req.body.code,
            "id": len+1,
            "description": req.body.description
        }
        data.course.push(course)
        fs.writeFile("./courses.json", JSON.stringify(data),(err) => {
            if (err) {
              console.log("Error writing file", err);
            } else {
              console.log("Successfully wrote file");
            }})
    }
    res.send(data.course)
})
app.put('/web/courses/:id',(req,res) => {
    const requested_course = data.course.find((c) => c.id === parseInt(req.params.id))
  if (!requested_course){
    return res.send("No Such Course")
  } 
  req.body.name=(req.body.name) ? req.body.name : requested_course.name
  req.body.code=(req.body.code) ? req.body.code : requested_course.code
    const err=validation(req.body)
    if (err){
        return res.send(err.details[0].message)
    }
    else{
        const course={
            "name":req.body.name,
            "code": req.body.code,
            "id": requested_course.id,
            "description": (req.body.description) ? req.body.description : requested_course.description
        }
        data.course[parseInt(req.params.id)-1]=course
        fs.writeFile("./courses.json", JSON.stringify(data),(err) => {
            if (err) {
              console.log("Error writing file", err);
            } else {
              console.log("Successfully wrote file");
            }})
    }
    res.send(data.course)
})
app.delete('/api/courses/:id',(req, res) => {
    const requested_course = data.course.find((c) => c.id === parseInt(req.params.id))
  if (!requested_course){
    return res.send("No Such Course")
  } 
  
    data.course.splice(data.course.indexOf(requested_course),1)
    console.log(data.course)

    fs.writeFile("courses.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log("Error writing file", err)
      } else {
        console.log("Successfully wrote file")
      }
    });
  
    res.send(data.course)
  })

  ///////////////////////////////////////////
  const validation_student= (data) => {
    const code_format = /^([a-zA-Z'-](\s)?)*$/;
    const schema = Joi.object({
      code: Joi.string().length(7).required(),
      name: Joi.string().pattern(new RegExp(code_format)).min(6).required(),
    })
    const { error } = schema.validate(data)
    return error
  } 

  app.get('/api/students/:id',(req,res) =>{
    const requested_student = student_data.student.find((s) => s.id === parseInt(req.params.id))
    if (!requested_student){
      return res.send("No Such student")
    } 
    res.send(requested_student)
  })
  app.get('/api/students/',(req,res) =>{
      res.send(student_data.student)
    })
  
  app.post('/web/students/create',(req,res) => {
    req.body.name=req.body.name.trim()
      const err=validation_student(req.body)
      if (err){
          return res.send(err.details[0].message)
      }
      else{
          const student={
              "name":req.body.name,
              "code": req.body.code,
              "id": Object.keys(student_data.student).length+1
          }
          student_data.student.push(student)
          fs.writeFile("./students.json", JSON.stringify(student_data),(err) => {
              if (err) {
                console.log("Error writing file", err);
              } else {
                console.log("Successfully wrote file");
              }})
      }
      res.send(student_data.student)
  })
  app.put('/web/students/:id',(req,res) => {
    const requested_student = student_data.student.find((s) => s.id === parseInt(req.params.id))
    if (!requested_student){
      return res.send("No Such student")
    } 
    req.body.name=(req.body.name) ? req.body.name : requested_student.name
    req.body.code=(req.body.code) ? req.body.code : requested_student.code
    req.body.name=req.body.name.trim()
      const err=validation_student(req.body)
      if (err){
          return res.send(err.details[0].message)
      }
      else{
          const student={
              "name":req.body.name,
              "code": req.body.code,
              "id": requested_student.id,
          }
          student_data.student[parseInt(req.params.id)-1]=student
          fs.writeFile("./students.json", JSON.stringify(student_data),(err) => {
              if (err) {
                console.log("Error writing file", err);
              } else {
                console.log("Successfully wrote file");
              }})
      }
      res.send(student_data.student)
  })
  app.delete('/api/students/:id',(req, res) => {
    const requested_student = student_data.student.find((s) => s.id === parseInt(req.params.id))
    if (!requested_student){
      return res.send("No Such student")
    } 
    
      student_data.student.splice(student_data.student.indexOf(requested_student),1)
  
      fs.writeFile("students.json", JSON.stringify(student_data), (err) => {
        if (err) {
          console.log("Error writing file", err)
        } else {
          console.log("Successfully wrote file")
        }
      });
    
      res.send(student_data.student)
    })
app.listen(3000,() => {console.log('listening on port 3000...')})