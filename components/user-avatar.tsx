import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";

export const UserAvatar = () => {
  const { user } = useUser();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <div>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
