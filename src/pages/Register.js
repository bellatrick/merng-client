import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../components/utils/hooks";
import { AuthContext } from "../context/auth";
const Register = (props) => {
  const context= useContext(AuthContext)
  const initialState = {
    username: "",
    password: "",
    confirmPassword: "", 
    email: "",
  }
 const {onChange,onSubmit,values} = useForm(registerUser, initialState)
  const [errors, seterrors] = useState({});
  
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      console.log(result);
      context.login(result.data.register)
      props.history.push('/')
    },
    onError(err) {
      console.log(err.graphQLErrors);
      seterrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });
function registerUser(){
    addUser()
}

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="username"
          placeholder="Username..."
          name="username"
          error={errors.username? true:false}
          value={values.username}
          onChange={onChange}
        ></Form.Input>

        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          error={errors.password? true:false}
          value={values.password}
          onChange={onChange}
        ></Form.Input>

        <Form.Input
          label="ConfirmPassword"
          placeholder="ConfirmPassword..."
          type="password"
          error={errors.confirmPassword? true:false}
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
        ></Form.Input>

        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          error={errors.email ? true:false}
          value={values.email}
          onChange={onChange}
        ></Form.Input>
        <Button type="submit" color="blue">
          Register
        </Button>
      </Form>
   {Object.keys(errors).length > 0 &&<div className="ui error message">
        <ul className="list">
          {Object.keys(errors).length > 0 &&
            Object.values(errors).map((value) =>(
                <li key={value}>{value}</li>
            )
            )}
        </ul>
      </div>}
    </div>
  );
};
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      created
      token
    }
  }
`;
export default Register;
