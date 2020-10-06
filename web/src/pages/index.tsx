import NavBar from "../components/NavBar";
import { withUrqlClient } from "next-urql";

import { createUrlClient } from "../utils/createUrlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

withUrqlClient;

export default withUrqlClient(createUrlClient, { ssr: true })(Index);
