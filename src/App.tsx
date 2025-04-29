import "./App.css";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormDescription, FormMessage } from "./components/ui/form";
import { Button } from "./components/ui/button";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { useState, useTransition } from "react";
import { FormError } from "./components/FormError";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { InfoAlert } from "./components/InfoAlert";

// Types for form values
type FormValues = {
  username: string;
};

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  updated_at: string;
};

function App() {
  const [isPending, startTransition] = useTransition();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [commitLog, setCommitLog] = useState<any[]>([]);
  const [userExists, setUserExists] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      setError("");
      setRepos([]);
      setCommitLog([]);
      setUserExists(false);
      setInfoMessage("");

      const trimmedUsername = values.username.trim();

      try {
        const reposRes = await fetch(
          `https://api.github.com/users/${trimmedUsername}/repos`
        );

        if (reposRes.status === 404) {
          setError("User not found. Please check the username and try again.");
          setRepos([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }
        if (reposRes.status === 403) {
          setError(
            "Rate limit exceeded. Please wait a while or authenticate to increase your limit."
          );
          setRepos([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }
        if (!reposRes.ok) {
          setError(
            "An error occurred while fetching the GitHub data. Please try again later."
          );
          setRepos([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }
        // Fetching events for commmits
        const eventsRes = await fetch(
          `https://api.github.com/users/${trimmedUsername}/events/public`
        );

        if (eventsRes.status === 404) {
          setError("User not found. Please check the username and try again.");
          setCommitLog([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }
        if (eventsRes.status === 403) {
          setError(
            "Rate limit exceeded. Please wait a while or authenticate to increase your limit."
          );
          setCommitLog([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }
        if (!eventsRes.ok) {
          setError(
            "An error occurred while fetching the GitHub data. Please try again later."
          );
          setCommitLog([]);
          setUserExists(false);
          setInfoMessage("");
          return;
        }

        setUserExists(true);
        setInfoMessage(
          "Please note that the GitHub events API only shows the events of the last 30 days. If commits are not visible then that means there are no recent commits"
        );

        const reposData = await reposRes.json();
        const eventsData = await eventsRes.json();

        // Filter only PushEvents (which contain commits)
        const commitEvents = eventsData.filter(
          (event: any) => event.type === "PushEvent"
        );

        // Extract commit info from each PushEvent
        const commits = commitEvents.flatMap((event: any) =>
          event.payload.commits.map((commit: any) => ({
            message: commit.message,
            repo: event.repo.name,
            url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
            date: event.created_at,
          }))
        );

        setRepos(reposData);
        setCommitLog(commits);
      } catch (err) {
        console.error("Error fetching GitHub repos:", err);
      }
    });
  };

  return (
    <>
      <main className="bg-zinc-950 min-h-screen max-w-screen flex items-center justify-center">
        <Card className="w-[400px] bg-stone-950 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              GitHub Profile Analyzer
            </CardTitle>
            <CardDescription>
              Please enter the username of the GitHub profile you want to
              analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} id="form">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the username" {...field} />
                      </FormControl>
                      {/* FormDescription here is being used to display the validation errors */}
                      {/* <FormDescription>
                        This is username we will search for.
                      </FormDescription> */}
                      {/* FormMessage here is being used to display the validation errors */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          {/* Display repos below */}
          {userExists && (
            <Tabs defaultValue="repo" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2 px-6 ">
                <TabsTrigger
                  value="repo"
                  className="bg-transparent data-[state=active]:border-b-2 p-2"
                >
                  Repositories
                </TabsTrigger>
                <TabsTrigger
                  value="commits"
                  className="bg-transparent data-[state=active]:border-b-2 p-2"
                >
                  Commits
                </TabsTrigger>
              </TabsList>
              <TabsContent value="repo">
                <CardContent className="pt-2">
                  <h2 className="text-lg mb-3">Public Repositories</h2>
                  {repos.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No public repositories found.
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {repos.map((repo) => (
                        <li
                          key={repo.id}
                          className=" p-3 rounded bg-stone-900 flex flex-col gap-2"
                        >
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {repo.name}
                          </a>
                          <p className="text-sm">{repo.description}</p>
                          <p className="text-sm text-gray-400">
                            Last updated:{" "}
                            {new Date(repo.updated_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>

                          <p className="text-xs text-yellow-400">
                            ⭐ {repo.stargazers_count}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </TabsContent>
              <TabsContent value="commits">
                <CardContent className="pt-2">
                  <h2 className="text-lg mb-3">Recent Commits</h2>
                  {commitLog.length === 0 ? (
                    <p className="text-sm text-gray-400">No commits found.</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {commitLog.map((commit, index) => (
                        <li
                          key={index}
                          className="p-3 rounded bg-stone-900 flex flex-col gap-1"
                        >
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline font-medium reak-words truncate whitespace-normal"
                          >
                            {commit.message}
                          </a>
                          <p className="text-sm text-gray-400">
                            <span className="text-white">{commit.repo}</span> -{" "}
                            {new Date(commit.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          )}
          <CardFooter className="flex flex-col gap-3">
            <FormError message={error} />
            <InfoAlert message={infoMessage} />
            <Button
              type="submit"
              className="w-full capitalize"
              disabled={isPending}
              form="form"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                <>Begin Search</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default App;
