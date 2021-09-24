import React, { useState } from "react";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "./utils/Graphql";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { cloneDeep } from "@apollo/client/utilities";
const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = cloneDeep(proxy.readQuery({ query: FETCH_POSTS_QUERY }));
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callback) callback();
    },
     variables: { postId, commentId },
  });
  return (
    <>
      <Popup
      content={commentId? 'Delete Comment':'Delete Post'}
        trigger={
          <Button
            as="div"
            
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" color="red" style={{ margin: "0" }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id 
      comments {
        id
        body
        created
        username
      }
    }
  }
`;
export default DeleteButton;
