// // pages/dashboard.js

// // import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// // const Dashboard = ({ user }) => {
// //   return <div>Hello {user.name}</div>;
// // };

// // export const getServerSideProps = withPageAuthRequired();

// // export default Dashboard;

// // import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// // const Dashboard = withPageAuthRequired(({ user }) => {
// //   return <p>Welcome {user.name}</p>;
// // });

// // export default Dashboard;




// //This is the same as pages/myPage/index.js but doesn't work as user is undefined!

// import { withPageAuthRequired, getSession} from "@auth0/nextjs-auth0";

// // const Dashboard = withPageAuthRequired(({ user }) => {
// //   return <p>Welcome {user.name}</p>;
// // });

// // export default Dashboard;



// const Dashboard = ({user}) => {
//   console.log("hi")
//   return(
// <p>Hello {user.name}</p>
//   )
// }

// export default Dashboard;


// export const getServerSideProps = withPageAuthRequired({
//   getServerSideProps: async ({ req, res }) => {
//     const auth0User = getSession(req, res);

//     // Fetch the user from the db (by email)
//    // let user = await db.user.findUnique({ where: { email: auth0User?.user.email } });

//     // You might want to move the creation of the user somewhere else like afterCallback
//     // Checkout https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html
//     // if (!user) {
//     //   user = db.user.create(auth0User?.user);
//     // } 

//     return {
//       props: {
//         // dbUser: user,
//         user: (await auth0User).user
//       },
//     };
//   },
// })