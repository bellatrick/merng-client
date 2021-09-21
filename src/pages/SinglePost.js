import gql from "graphql-tag";
import React, { useContext, useState, useRef } from "react";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";

import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
const SinglePost = (props) => {
  const commentInputRef = useRef();
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  console.log(postId)
  const { data } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
    },
  });
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
  });
  const deleteButtonCallback = () => {
    props.history.push("/");
  };
  let postMarkup;
  if (!data?.getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      created,
      username,
      likeCount,
    
      likes,
      comments,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size="small"
              floated="right"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(created).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  user={user}
                  id={id}
                  likes={likes}
                  likeCount={likeCount}
                />
                <Popup
                  content="Comment on Post"
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("hi")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color='blue' pointing="left">
                        {comments.length}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deleteButtonCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        name="comment"
                        ref={commentInputRef}
                      />
                      <button
                        onClick={submitComment}
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.created).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};
const FETCH_POSTS_QUERY = gql`
  query getPost($postId: ID) {
    getPost(postId: $postId) {
      id
      body
      created
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        created
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id commentCount
      comments {
        id
        body
        created
        username
      }
     
    }
  }
`;
export default SinglePost;
