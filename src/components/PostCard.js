import React, { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Card,
  Icon,
  Label,
  Image,
  Button,
  Popup,
  Container,
} from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
const PostCard = (props) => {
  const { user } = useContext(AuthContext);
  const {
    body,
    comments,
    created,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = props.post;

  return (
    <div className='ui two column grid container'>
      <Card fluid>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>
            {moment(created).fromNow(true)}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <LikeButton user={user} id={id} likes={likes} likeCount={likeCount} />
          <Popup
            content="comment on posts"
            trigger={
              <Button as={Link} to={`posts/${id}`} labelPosition="right">
                <Button color="blue" basic>
                  <Icon name="comments" />
                </Button>
                <Label as="a" basic color="blue" pointing="left">
                  {comments.length}
                </Label>
              </Button>
            }
          />

          {user && user.username === username && <DeleteButton postId={id} />}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PostCard;
