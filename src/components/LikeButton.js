import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Label, Popup } from "semantic-ui-react";
const LikeButton = (props) => {
  const [likes, setLikes] = useState(false);
  useEffect(() => {
    if (
      props.user &&
      props.likes.find((like) => like.username === props.user.username)
    ) {
      setLikes(true);
    } else setLikes(false);
  }, [props.user, props.likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: props.id },
  });
  const likeButton = props.user ? (
    likes ? (
      <Button color="pink">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="grey" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="grey" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );
  return (
    <div>
      <Popup
        content={likes?'Unlike post':'Like Post'}
        trigger={
          <Button as="div" labelPosition="right" onClick={likePost}>
            {" "}
            {likeButton}
            <Label as="a" basic color="grey" pointing="left">
              {props.likeCount}
            </Label>
          </Button>
        }
      />
    </div>
  );
};
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
export default LikeButton;
