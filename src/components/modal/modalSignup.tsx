import React, { useEffect, useMemo } from "react";
import GoogleLogin from "../googleLogin";
import { ExpandType, ExpandingDiv } from "../animationDivs";
import { useModal } from "../../hooks/useModal";
import { useSelector } from "react-redux";
import { ModalTypes, selectModal } from "../../lib/features/modal/modalSlice";

export default function ModalSignup() {
  const { closeModal } = useModal();
  const { modalStack } = useSelector(selectModal);

  const shouldShow = useMemo<boolean>(() => {
    return modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.REGISTER);
  }, [modalStack]);

  return (
    <ExpandingDiv
      expandType={ExpandType.BottomToTop}
      className="w-full h-full absolute bottom-0 left-0 overscroll-none z-50"
      isOpen={shouldShow}
    >
      <div
        className="absolute h-screen w-screen top-0 left-0 z-10 bg-background opacity-50"
        onClick={() => closeModal()}
      />
      <div className="w-full h-4/5 rounded-t-5xl absolute bottom-0 left-0 bg-background opacity-95 z-20"></div>

      <div className="w-full h-4/5 absolute bottom-0 flex flex-col justify-center items-start gap-2 z-30 opacity-100 p-8">
        <div className="text-lg font-bold leading-9">Whoops!</div>
        <div className="text-lg font-normal leading-9">
          It looks like you're not part of the club yet. <br />
          Join us with a quick login and start building you dream library!
        </div>
        <GoogleLogin />
      </div>
    </ExpandingDiv>
  );
}
