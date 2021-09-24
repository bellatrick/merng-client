import React from "react";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "./utils/Graphql";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "./utils/hooks";
import { cloneDeep } from "@apollo/client/utilities";
const PostForm = () => {
  const initialState = {
    body: "",
  };
  const { values, onChange, onSubmit } = useForm(
    createPostCallback,
    initialState
  );
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = cloneDeep(
        proxy.readQuery({
          query: FETCH_POSTS_QUERY,
          variables: { limit: 5, offset: 0 },
        })
      );

      console.log(result);
      data.getPosts.unshift(result.data.createPost);
      console.log(data);

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data,
        variables: { limit: 5, offset: 0 },
      });

      values.body = "";
    },
  });
  function createPostCallback() {
    createPost();
  }
  return (
    <Form className='post-form' onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Post
        </Button>
      </Form.Field>
      {error && (
        <div className="ui error message" style={{ marginBottom: "20px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
      <br/>
    </Form>
  );
};
const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      created
      username
      commentCount
      likeCount
      likes {
        id
        username
        created
      }
      comments {
        id
        username
        created
      }
    }
  }
`;
export default PostForm;
