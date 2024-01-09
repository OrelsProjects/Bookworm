import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import Image from "next/image";
import { createPortal } from "react-dom";

interface EmptyTableProps {
  isSearch?: boolean;
  className?: string;
}

export default function EmptyTable({
  isSearch,
  className,
}: EmptyTableProps): React.ReactNode {
  const router = useRouter();
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalEl(document.getElementById("portal"));
    }
  }, []);

  const onSearchClick = () => {
    router.push("/home");
  };

  const Background = () => (
    <div
      className={`w-screen h-screen bg-background flex justify-center items-center ${className}`}
    >
      <div className="z-20 w-full h-full flex justify-center">
        <Image
          src="/emptyLibraryHeader.png"
          fill
          alt={""}
          className="text input pointer-events-none !h-96 !w-288 !relative"
        />
      </div>
      <div className="z-10">
        <Image
          src="/background_shadow.png"
          fill
          alt={""}
          className="text input pointer-events-none !h-96 "
        />
      </div>
      <div className="opacity-10 absolute top-0 left-0 right-0 bottom-0 z-0">
        <Image
          src="/emptyLibraryBackground.png"
          height={1080}
          width={1920}
          alt={""}
          className="text input  pointer-events-none"
        />
      </div>
    </div>
  );

  const SearchEmptyTable = (): React.ReactNode => (
    <p className="text-6.5xl leading-16">No results found...</p>
  );

  return (
    <div className="h-full w-full flex flex-col justify-center mb-52 items-center gap-6">
      {isSearch ? (
        <SearchEmptyTable />
      ) : (
        <>
          <p className="text-6.5xl leading-16">Your library is empty...</p>
          <Button
            variant="selected"
            className="text-lg leading-5 font-semibold p-4 rounded-full"
            onClick={onSearchClick}
          >
            Let me search
          </Button>
          {/* {portalEl && createPortal(<Background />, portalEl)} */}
        </>
      )}
    </div>
  );
}
