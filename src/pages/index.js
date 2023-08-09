'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (      
      <>
       
        
       
      <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
      
      <h1 className="font-mono text-6xl">SmartDeck</h1>
      <p>
        Welcome {user.name}! 
        {/* {user.nickname}  */}
        {/* <a href="/api/auth/logout">Logout</a> */}
        </p>
       
      <p>Create a flashcard deck and enter Training mode to practise your cards! 
        The handy traffic light system will show you whether your last 7 attempts were right or wrong. 
        Each card also has a coloured bar at the top to indicate how well you know it.</p>
       

<p>Test</p>      

      </div>
     
      </>
    );
  }

  return  <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
<h1 className="font-mono text-6xl flex flex-col">SmartDeck</h1>
<a href="/api/auth/signup">Sign up</a>
<a href="/api/auth/login">Log in</a>
</div>;
}
