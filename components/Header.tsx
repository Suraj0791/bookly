import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import UserStatus from "@/components/UserStatus";

const Header = () => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <div className="flex items-center gap-4">
        <UserStatus />
        <form
          action={async () => {
            "use server";

            await signOut();
          }}
        >
          <Button>Logout</Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
