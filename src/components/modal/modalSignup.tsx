import React from "react";
import GoogleLogin from "../googleLogin";
import { ExpandType, ExpandingDiv } from "../animationDivs";
import { useModal } from "../../hooks/useModal";
import { IoClose } from "react-icons/io5";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const Title = () => <div className="text-lg font-bold leading-9">Whoops!</div>;
const Body = ({ className }: { className?: string }) => (
  <div className={cn("text-lg font-normal leading-9", className)}>
    It looks like you're not part of the club yet. <br />
    Join us with a quick login and start building you dream library!
  </div>
);

export default function ModalSignup() {
  const { closeModal } = useModal();

  const Login = () => (
    <GoogleLogin
      text="Continue with Google"
      onClickBefore={() => {
        localStorage.setItem("redirect", window.location.pathname);
      }}
      className="!w-full justify-start gap-3 pl-5"
    />
  );

  const Mobile = () => (
    <div className="full h-full absolute bottom-0 left-0 top-0 right-0 overscroll-none z-50 md:hidden">
      <div
        className="absolute h-screen w-screen top-0 left-0 z-10 bg-background opacity-50"
        onClick={() => closeModal()}
      />
      <ExpandingDiv
        expandType={ExpandType.BottomToTop}
        className="w-full h-full absolute bottom-0 left-0 overscroll-none"
      >
        <div className="w-full h-4/5 rounded-t-5xl absolute bottom-0 left-0 bg-background opacity-95 z-20"></div>
        <div className="w-full h-4/5 absolute bottom-0 flex flex-col justify-center items-start gap-8 z-30 opacity-100 p-8">
          <IoClose
            className="absolute right-4 top-4 w-6 h-6"
            onClick={() => closeModal()}
          />
          <div>
            <Title />
            <Body />
          </div>
          <Login />
        </div>
      </ExpandingDiv>
    </div>
  );

  const Desktop = () => (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Title />
          </DialogTitle>
          <DialogDescription>
            <Body className="leading-6" />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <Login />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Mobile />
      <Desktop />
    </>
  );
}
