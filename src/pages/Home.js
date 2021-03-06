import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../components/utils/Graphql";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import {CircularProgress} from '@material-ui/core'
const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  if (data) {
    console.log(data);
  }
  return (
    <div style={{marginTop:20}}>
      <Grid stackable columns={3}>
        <Grid.Row></Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}

          {loading ? (
            <div className='circular-progress'><CircularProgress/></div>
          ) : (
            <Transition.Group>
              {data &&
                data.getPosts.map((post) => (
                  <Grid.Column fluid key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
