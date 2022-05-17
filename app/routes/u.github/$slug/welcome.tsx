import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import TextField from "~/components/TextField";
import { destroySession, getCurrentUser, getSession } from "~/session.server";
import { User } from "~/types";
import formStyles from "~/styles/forms.css";
import Button from "~/components/Button";
import CloseIcon from "~/components/icons/CloseIcon";
import { getProfileRouteForUser } from "~/utils/routes";

export function links() {
  return [{ rel: "stylesheet", href: formStyles }];
}

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

  return json({ user: currentUser });
};

const Welcome: FC = () => {
  const { user } = useLoaderData<{ user: User }>();

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div
          className="bg-white max-w-7xl mx-auto rounded-lg border p-8 w-full relative overflow-hidden"
          style={{ paddingLeft: "calc(185px + 2rem)" }}
        >
          <div className="modal-decoration" />
          <div className="flex gap-6 mb-8">
            <img
              src={user.avatar}
              style={{ width: 108, height: 108 }}
              className="rounded-full flex-shrink-0"
              alt="Your avatar pulled from GitHub"
            />
            <div>
              <h1 className="font-semibold text-2xl mb-2 text-light-type">
                Welcome contributor!
              </h1>
              <p className="max-w-md text-light-type-low text-sm">
                You're almost done creating your profile on{" "}
                <strong>Open-Source Hub</strong> using your GitHub account (
                {user.email})
              </p>
            </div>
            <Link to="/profile" className="absolute top-6 right-6 p-2">
              <CloseIcon />
            </Link>
          </div>
          <div>
            <p className="font-medium mb-4 text-light-type">
              Tell us more about yourself
            </p>
            <Form method="post" action="/u/github/update-profile">
              <div className="flex gap-8">
                <div className="w-full md:w-1/2 space-y-6">
                  <TextField
                    readOnly
                    value={user.githubLogin}
                    label="Name"
                    id="name"
                  />
                  <TextField
                    readOnly
                    value={user.email}
                    label="Email"
                    id="email"
                  />
                  <TextField label="Twitter" id="twitter" />
                  <TextField label="LinkedIn" id="linkedin" />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <TextField label="Tech interests" id="techInterests" />
                  <TextField
                    label="Subject matter interests"
                    id="subjectInterests"
                  />
                  <TextField
                    label="Contribution interests"
                    id="contributionInterests"
                  />
                  <div className="pt-10">
                    <label
                      className="text-sm flex gap-2 text-light-type-medium"
                      id="joinDiscord"
                    >
                      <input type="checkbox" />
                      Join the Open-Source Hub Discord server
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-16 flex justify-end gap-6">
                <Link
                  to={getProfileRouteForUser(user)}
                  style={{ width: 200 }}
                  className="h-12 text-light-interactive hover:bg-light-interactive-fill rounded-lg font-semibold flex items-center justify-center"
                >
                  Cancel
                </Link>
                <Button type="submit" style={{ width: 250 }} className="h-12">
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
