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

import toast from "react-hot-toast";

const endpoint = "http://localhost:3000/dev/api/user-book";
const bookId = 1;

const formSchemaUserId = z.object({
  userId: z.string().uuid(),
});

const formSchemaUpdateUserBook = z.object({
  userBookId: z.coerce.number().optional(),
  userComments: z.string(),
  userRating: z.coerce
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  isFavorite: z.coerce.boolean().optional(),
  suggestionSource: z.string().optional(),
});

const formSchemaAddUserBook = z.object({
  userId: z.string(),
  bookId: z.coerce.number().positive(),
  suggestionSource: z.string().optional(),
  userComments: z.string().optional(),
  userRating: z.coerce
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  isDeleted: z.boolean().optional(),
  isFavorite: z.coerce.boolean().optional(),
});

const UserBookManagement = () => {
  const [userBookId, setUserBookId] = useState<number>(17);
  const [userId, setUserId] = useState<string>(
    "6b29bcf5-cbfa-4c43-8993-ba480fdf655d"
  );

  const formUserId = useForm<z.infer<typeof formSchemaUserId>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaUserId),
    defaultValues: {
      userId: userId,
    },
  });
  const formAddUserBook = useForm<z.infer<typeof formSchemaAddUserBook>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaAddUserBook),
    defaultValues: {
      userId: userId,
      bookId: bookId,
    },
  });

  const formUpdateUserBook = useForm<z.infer<typeof formSchemaUpdateUserBook>>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaUpdateUserBook),
    defaultValues: {
      userComments: "",
      userRating: 2,
      isFavorite: false,
    },
  });

  const [userBooks, setUserBooks] = useState<any>({
    userId: userId,
    bookId: bookId,
  });

  const [addingUserBook, setAddingUserBook] = useState<boolean>(false);
  const [fetchingUserBook, setFetchingUserBook] = useState<boolean>(false);
  const [updatingUserBook, setUpdatingUserBook] = useState<boolean>(false);
  const [deletingUserBook, setDeletingUserBook] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const addUserBook = async (values: z.infer<typeof formSchemaAddUserBook>) => {
    try {
      setAddingUserBook(true);
      setError(null);
      const userBook = {
        bookId: values.bookId,
        userComments: values.userComments,
        readingStatusId: 2,
        userRating: values.userRating ?? 0,
        isFavorite: values.isFavorite ?? false,
        suggestionSource: values.suggestionSource,
      };
      const response = await axios.post(endpoint, userBook, {
        headers: { user_id: values.userId },
      });
      formAddUserBook.reset();
      setUserBookId(response.data.userBookId);
      toast.success("User Book Added");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setAddingUserBook(false);
    }
  };

  const updateUserBook = (values: z.infer<typeof formSchemaUpdateUserBook>) => {
    setUpdatingUserBook(true);
    setError(null);
    values.userBookId = userBookId;
    axios
      .put(endpoint, values, { headers: { user_id: userId } })
      .then(() => {
        getUserBook();
        toast.success("User Book Updated");
      })
      .catch((error) => {
        setError(error.message);
        toast.error(error.message);
      })
      .finally(() => {
        setUpdatingUserBook(false);
      });
  };

  const deleteUserBook = () => {
    setDeletingUserBook(true);
    setError(null);
    axios
      .delete(`${endpoint}?userBookId=${userBookId}`, {
        headers: { user_id: userId },
      })
      .then((response) => {
        setUserBooks(null);
        toast.success("User Book Deleted");
      })
      .catch((error) => {
        setError(error.message);
        toast.error(error.message);
      })
      .finally(() => {
        setDeletingUserBook(false);
      });
  };

  const getUserBook = () => {
    setFetchingUserBook(true);
    setError(null);
    axios
      .get(endpoint, { headers: { user_id: userBooks?.userId } })
      .then((response) => {
        const data = response.data;
        setUserBooks(data);
        toast.success("User Book Retrieved");
      })
      .catch((error) => {
        setError(error.message);
        toast.error(error.message);
      })
      .finally(() => {
        setFetchingUserBook(false);
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
    setUserId(userId);
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
                  User Id
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

      <Form {...formAddUserBook}>
        <form
          onSubmit={formAddUserBook.handleSubmit(addUserBook)}
          className="space-y-4 flex flex-col gap-2"
        >
          <Label className="font-bold text-xl">Add User Book</Label>
          <FormField
            control={formAddUserBook.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  User Id
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUserBook.control}
            name="bookId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Book Id
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUserBook.control}
            name="userComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  User Comments
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUserBook.control}
            name="userRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  User Rating
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUserBook.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Is Favorite
                </FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formAddUserBook.control}
            name="suggestionSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Suggestion Source
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Include other fields as needed */}
          <Button type="submit">
            {addingUserBook ? <Loading /> : "Add User Book"}
          </Button>
        </form>
      </Form>

      <Form {...formUpdateUserBook}>
        <form
          onSubmit={formUpdateUserBook.handleSubmit(updateUserBook)}
          className="space-y-4 flex flex-col gap-2"
        >
          <Label className="font-bold text-xl">Update User Book</Label>
          <div>
            {userBookId ? (
              <div>{`User Book Id: ${userBookId}`}</div>
            ) : (
              <div>
                User Book Id:
                <br /> Add a book <br />
                to get a user book id
              </div>
            )}
          </div>
          <FormField
            control={formUpdateUserBook.control}
            name="userComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  User Comments
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formUpdateUserBook.control}
            name="userRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  User Rating
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formUpdateUserBook.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Is Favorite
                </FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formUpdateUserBook.control}
            name="suggestionSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Suggestion Source
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Include other fields as needed */}
          <Button type="submit">
            {updatingUserBook ? <Loading /> : "Update User Book"}
          </Button>
        </form>
      </Form>
      <FormItem>
        <Button onClick={deleteUserBook} variant="destructive">
          {deletingUserBook ? <Loading /> : "Delete User Book"}
        </Button>
      </FormItem>
      <FormItem>
        <Button onClick={getUserBook}>
          {fetchingUserBook ? <Loading /> : "Get User Book"}
        </Button>
      </FormItem>

      {/* Display User Book Details and Errors */}
      {
        <div className="user-book-details flex flex-col w-12">
          <Label className="font-bold text-xl">User Book Details</Label>
          {/* <div>User ID: {userBook?.userId}</div>
          <div>Book ID: {userBook?.bookId}</div>
          <div>User Comments: {userBook?.userComments}</div>
          <div>User Rating: {userBook?.userRating}</div>
          <div>Is Favorite: {userBook?.isFavorite ? "Yes" : "No"}</div>
          <div>Suggestion Source: {userBook?.suggestionSource}</div> */}
          <div>{`${JSON.stringify(userBooks)}`}</div>
        </div>
      }
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default UserBookManagement;
