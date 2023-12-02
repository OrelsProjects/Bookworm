"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/form";

import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@radix-ui/react-label";

import { v4 } from "uuid";

const formSchemaUserId = z.object({
  userId: z.string().uuid(),
});

const formSchemaUpdateUser = z.object({
  displayName: z.string(),
  bio: z.string(),
});

const formSchemaAddUser = z.object({
  email: z.string().email(),
  displayName: z.string(),
  bio: z.string(),
});

const endpoint = "http://localhost:3000/dev/api/user";

const UserManagement = () => {
  const formUserId = useForm<z.infer<typeof formSchemaUserId>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaUserId),
    defaultValues: {
      userId: "6b29bcf5-cbfa-4c43-8993-ba480fdf655d",
    },
  });

  const formAddUser = useForm<z.infer<typeof formSchemaAddUser>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaAddUser),
    defaultValues: {
      email: "",
      displayName: "Test User",
      bio: "Test Bio",
    },
  });

  const formUpdateUser = useForm<z.infer<typeof formSchemaUpdateUser>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaUpdateUser),
    defaultValues: {
      displayName: "Test User",
      bio: "Test Bio",
    },
  });

  const [user, setUser] = useState<any>({
    user_id: "6b29bcf5-cbfa-4c43-8993-ba480fdf655d",
  });

  const [addingUser, setAddingUser] = useState<boolean>(false);
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);
  const [updatingUser, setUpdatingUser] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const addUser = async (values: any) => {
    try {
      setAddingUser(true);
      setError(null);
      const user = {
        user_id: v4(),
        email: values.email,
        displayName: values.displayName,
        bio: values.bio,
      };
      const response = await axios.post(endpoint, values, {
        headers: { user_id: user.user_id },
      });
          formAddUser.reset();
      setUser(user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setAddingUser(false);
    }
  };

  const updateUser = (values: z.infer<typeof formSchemaUpdateUser>) => {
    setUpdatingUser(true);
    setError(null);
    axios
      .put(endpoint, values, { headers: { user_id: user?.user_id } })
      .then(() => {
        getUser();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setUpdatingUser(false);
      });
  };

  const deleteUser = () => {
    setDeletingUser(true);
    setError(null);
    axios
      .delete(endpoint, { headers: { user_id: user?.user_id } })
      .then((response) => {
        console.log(response);
        setUser(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setDeletingUser(false);
      });
  };

  const getUser = () => {
    setFetchingUser(true);
    setError(null);
    axios
      .get(endpoint, { headers: { user_id: user?.user_id } })
      .then((response) => {
        const data = response.data;
        const user = {
          user_id: data.userId,
          email: data.email,
          displayName: data.displayName,
          bio: data.bio,
        };
        setUser(user);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setFetchingUser(false);
      });
  };

  const Loading = () => (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  const updateUserId = (values: z.infer<typeof formSchemaUserId>) => {
    const userId = values.userId;
    const currentUser = { ...user, user_id: userId };
    setUser(currentUser);
  };

  return (
    <div className="space-y-4 flex flex-row p-8 gap-4 justify-around">
      <Form {...formUserId}>
        <form
          onSubmit={formUserId.handleSubmit(updateUserId)}
          className="space-y-4 flex flex-col gap-2"
        >
          <Label className="font-bold text-xl">Update User Id</Label>
          <FormField
            control={formUserId.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  user id
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update User Id</Button>
        </form>
      </Form>

      <Form {...formAddUser}>
        <form
          onSubmit={formAddUser.handleSubmit(addUser)}
          className="space-y-4 flex flex-col gap-2"
        >
          <Label className="font-bold text-xl">Add User</Label>
          <FormField
            control={formAddUser.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUser.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  display name
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUser.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">bio</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{addingUser ? <Loading /> : "Add User"}</Button>
        </form>
      </Form>

      <Form {...formUpdateUser}>
        <form
          onSubmit={formUpdateUser.handleSubmit(updateUser)}
          className="space-y-4 flex flex-col gap-2"
        >
          <Label className="font-bold text-xl">Update User</Label>
          <FormField
            control={formUpdateUser.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  display name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formUpdateUser.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">bio</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {updatingUser ? <Loading /> : "Update User"}
          </Button>
        </form>
      </Form>
      <FormItem>
        <Button onClick={deleteUser} variant="destructive">
          {deletingUser ? <Loading /> : "Delete User"}
        </Button>
      </FormItem>
      <FormItem>
        <Button onClick={getUser}>
          {fetchingUser ? <Loading /> : "Get User"}
        </Button>
      </FormItem>

      {/* Display User Details and Errors */}
      {
        <div className="user-details flex flex-col">
          <Label className="font-bold text-xl">User Details</Label>
          <div>ID: {user?.user_id}</div>
          <div>Email: {user?.email}</div>
          <div>Display Name: {user?.displayName}</div>
          <div>Bio: {user?.bio}</div>
        </div>
      }
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default UserManagement;
