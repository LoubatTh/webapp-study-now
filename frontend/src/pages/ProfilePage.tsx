import { useUser } from "../contexts/UserContext";

const ProfilePage = () => {
  const { id, name, email, isSubscribed } = useUser();

  return (
    <>
      <div>ProfilePage</div>
      <p>id: {id}</p>
      <p>name: {name}</p>
      <p>email: {email}</p>
      <p>isSubscribed: {isSubscribed ? "true" : "false"}</p>
    </>
  );
};

export default ProfilePage;
