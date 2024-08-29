import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { db, auth } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";
import ModeToggle from "./ui/mode-toggle";
import Link from "next/link";
interface UserData {
  name: string;
  email: string;
  type: string;
  uid: string;
}

const SignIn: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(true);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const { user, setUser, setLoggedIn } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      const storedEmail = localStorage.getItem("rememberMeEmail");
      const storedPassword = localStorage.getItem("rememberMePassword");
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, [user, router]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  const handleRememberMeChange = (checked: boolean) => setRememberMe(checked);

  const updateUserState = (data: UserData, uid: string) => {
    setUser({
      name: data.name,
      email: data.email,
      type: data.type,
      uid,
    });
    setLoggedIn(true);
  };

  const handleLoginSuccess = (email: string, password: string) => {
    if (rememberMe) {
      localStorage.setItem("rememberMeEmail", email);
      localStorage.setItem("rememberMePassword", password);
    } else {
      localStorage.removeItem("rememberMeEmail");
      localStorage.removeItem("rememberMePassword");
    }
    toast({
      title: "Sign In successful",
      description: "Redirecting to dashboard",
    });
    router.push("/dashboard");
  };

  const loginMsg = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      const collections = ["Students", "Teachers", "Admins"];
      for (const collectionName of collections) {
        const docRef = doc(db, collectionName, user.uid);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          updateUserState(docSnapshot.data() as UserData, user.uid);
          handleLoginSuccess(email, password);
          return;
        }
      }

      toast({
        title: "Sign In successful",
        description: "Redirecting to dashboard",
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      toast({
        title: "Error signing in",
        description: "Please check your email and password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  async function forgotPassword(event: any): Promise<void> {
    if (email) {
      console.log(email);
      try {
        // Query the Teacher collection
        let q = query(
          collection(db, "Teachers"),
          where("email", "==", email)
        );
        let querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          toast({
            title: "Contact Hypertext Assasin for Password Reset",
            description: "Ask Hypertext Assasin for password reset directly",
            variant: "destructive",
          });
        } else {
          // If not found in OfficialLogin, check the Teachers collection
          q = query(collection(db, "Studets"), where("email", "==", email));
          querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            router.push(
              `mailto:HypertextAssasin@example.com?subject=Your%20Subject&body=This%20is%20the%20email%20body`
            );
          } else {
            toast({
              title: "Error",
              description: "No matching emails found",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        toast({
          title: "Error",
          description: "An error occurred while searching for the email",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Welcome to the Hypertext Assasins Website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handleChange(setPassword)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={handleRememberMeChange}
              />
              <Label htmlFor="remember-me">Remember Me</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col items-center w-full space-y-2">
            <Button
              className="w-full"
              onClick={loginMsg}
              disabled={!email || !password || loading}
            >
              {loading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
            <div
              className="text-xs text-red-500 text-center hover:underline underline-offset-2"
              onClick={forgotPassword}
            >
              Forgot password?
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
