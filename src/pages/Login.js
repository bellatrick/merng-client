import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../components/utils/hooks";
import { AuthContext } from "../context/auth";
const Login = (props) => {
  const {login} = useContext(AuthContext)
  const initialState = {
    username: "",
    password: "",
  };
const {onChange, onSubmit, values} =  useForm(loginUserCallback, initialState)
  const [errors, seterrors] = useState({});


  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      console.log(result);
      login(result.data.login)
      props.history.push('/')
    },
    onError(err) {
 
      seterrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

function loginUserCallback(){
  try{
    loginUser()
  }
   catch(err){
     console.log(err)
   } 
}
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
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

      
        <Button type="submit" color="blue">
          Login
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
const LOGIN_USER = gql`
  mutation login(
    $username: String!
   
    $password: String!

  ) {
    login(username: $username, password: $password
    ) {
      id
      email
      username
      created
      token
    }
  }
`;
export default Login