import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import type { FC } from "react";
import {
  commitSession,
  destroySession,
  getCurrentUser,
  getSession,
} from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import RootLayout from "~/components/RootLayout";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (!currentUser) {
    // Redirect to the login page if needed
    session.unset("idToken");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const data: User = {
    displayName: currentUser.name,
    avatar: currentUser.picture,
    email: currentUser.email,
  };

  return json(data, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

type User = {
  displayName: string;
  avatar?: string;
  email?: string;
};

const Profile: FC = () => {
  const currentUser = useLoaderData<User>();

  const title = currentUser.displayName
    ? `Welcome, ${currentUser.displayName}`
    : "My profile";

  return (
    <RootLayout>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-black-50 p-6 rounded-lg">
          <div className="flex gap-6">
            <img
              src={currentUser.avatar}
              style={{ width: 108, height: 108 }}
              alt="Your avatar"
              className="rounded-full flex-shrink-0"
            />
            <h1 className="text-4xl text-black-500 font-semibold">{title}</h1>
          </div>
        </div>
      </main>
    </RootLayout>
  );
};

export default Profile;
