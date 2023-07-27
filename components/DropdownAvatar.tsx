import { Dropdown, Avatar, Text, Grid } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "@/components/ui/Link";
import { signOut } from "next-auth/react";
import { inter } from "@/lib/constants";

export default function DropdownAvatar() {
  const { data: session } = useSession();

  return (
    <Grid.Container css={{ p: "$0" }} justify="flex-end" gap={2}>
      <Grid>
        <Dropdown placement="bottom-right">
          <Dropdown.Trigger css={{ zIndex: 10 }}>
            {session?.user?.image && (
              <Avatar
                bordered
                size="md"
                as="button"
                color="default"
                src={session.user.image}
              />
            )}
          </Dropdown.Trigger>
          <Dropdown.Menu
            color="default"
            className="bg-slate-50 dark:bg-slate-900"
            aria-label="Avatar Actions"
          >
            <Dropdown.Item
              key="profile"
              css={{ height: "$18", p: "$0" }}
              className={`${inter.className} text-base font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-1"
                href={`/user/${session?.user?.name || ""}`}
              >
                <Text className="dark:text-slate-100" b css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text className="dark:text-slate-100" b css={{ d: "flex" }}>
                  {session?.user?.name}
                </Text>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="my_profile"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-2 dark:text-slate-100"
                href={`/user/${session?.user?.name || ""}`}
              >
                My Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="add_resource"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-2 dark:text-slate-100"
                href="/resources/add"
              >
                Add Resource
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="view_resources"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-2 dark:text-slate-100"
                href="/resources"
              >
                View Resources
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="help_and_feedback"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-2 dark:text-slate-100"
                href="/terms-and-conditions"
              >
                Terms &amp; Conditions
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="account_settings"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <Link
                className="block w-full px-2 py-2 dark:text-slate-100"
                href="/user-settings"
              >
                Account Settings
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="logout"
              color="error"
              className={`${inter.className} text-sm font-medium dark:bg-slate-900 dark:hover:bg-slate-700 dark:focus:bg-slate-700`}
            >
              <button
                className="flex w-full px-2 py-2 font-semibold"
                onClick={() => {
                  signOut();
                }}>
                Log out
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
  );
}
