'use client'
import * as React from "react"
import { useState , useEffect } from "react" 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 
interface LoginFormProps {
  handlePersonnalData: (data: { firstname: string; lastname: string; username: string }) => void;
  signdata: {
    [key: string]: any;
    image?: File;
  };
}

export default function Loginform({ handlePersonnalData , signdata }: LoginFormProps): JSX.Element {
  const [loginErrors, setLoginErrors] = useState<{ firstname: boolean; lastname: boolean; username: boolean }>({
    firstname: false,
    lastname: false,
    username: false,
  });
  const [logdata, setLogdata] = useState<{ firstname: string; lastname: string; username: string }>({
    firstname: "",
    lastname: "",
    username: "",
  });

  useEffect(() => {
    if (signdata.firstname) {
      setLogdata((prevLogdata) => ({ ...prevLogdata, firstname: signdata.firstname }));
    }
    if (signdata.lastname) {
      setLogdata((prevLogdata) => ({ ...prevLogdata, lastname: signdata.lastname }));
    }
    if (signdata.username) {
      setLogdata((prevLogdata) => ({ ...prevLogdata, username: signdata.username }));
    }
  console.log(signdata);
}, [signdata.firstname, signdata.lastname, signdata.username]);


  const handleFirstname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(logdata);
    setLogdata({ ...logdata, firstname: e.target.value });
  };

  const handleLastname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogdata({ ...logdata, lastname: e.target.value });
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogdata({ ...logdata, username: e.target.value });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const errors = {
      firstname: logdata.firstname === "",
      lastname: logdata.lastname === "",
      username: logdata.username === "",
    };

    setLoginErrors(errors);

    // Si un des champs est vide, ne pas continuer
    if (errors.firstname || errors.lastname || errors.username) {
      setTimeout(() => {
        setLoginErrors({ firstname: false, lastname: false, username: false });
      }, 5000);
      return;
    }
    handlePersonnalData(logdata);
    // Ici, tu peux ajouter la logique une fois tous les champs remplis correctement
    console.log("Tous les champs sont remplis");
  };

  // Function pour gérer l'affichage de l'erreur
  const errorlog = (): void => {
    setTimeout(() => {
      setLoginErrors({ firstname: false, lastname: false, username: false });
    }, 5000);
  };

  return (
    <Card className="w-full  md:w-[450px]">
      <CardHeader>
        <h1 className="text-4xl font-semibold leading-none tracking-tight my-5">Let's Create Your Profile</h1>
      </CardHeader>
      <CardContent>
        {(loginErrors.firstname || loginErrors.lastname || loginErrors.username) && (
          <div className="text-red-600 flex items-center justify-center bg-red-300 h-12 text-base md:text-lg w-full">
            Remplissez tous les champs
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstname" className="md:text-base">
                Firstname*
              </Label>
              <Input
                id="firstname"
                className={`md:h-12 ${loginErrors.firstname ? "border-red-500 placeholder-red-500" : ""}`}
                placeholder="John"
                onChange={handleFirstname}
                value={logdata.firstname}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastname" className="md:text-base">
                Lastname*
              </Label>
              <Input
                id="lastname"
                className={`md:h-12 ${loginErrors.lastname ? "border-red-500 placeholder-red-500" : ""}`}
                placeholder="Doe"
                onChange={handleLastname}
                value={logdata.lastname}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="username" className="md:text-base">
                  Username*
                </Label>
              </div>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                required
                className={`md:h-12 ${loginErrors.username ? "border-red-500 placeholder-red-500" : ""}`}
                onChange={handleUsername}
                value={logdata.username}
              />
            </div>
          </div>
          <CardFooter className="flex flex-col gap-2 w-full px-0 justify-between">
            <Button size={"lg"} type="submit" className="w-full mt-10 md:text-lg">
              Next
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}