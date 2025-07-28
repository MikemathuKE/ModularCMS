import {
  MenuNav,
  Menu,
  MenuItem,
  MenuList,
} from "@/components/LayoutComponents";

export default function ExampleNavMenu() {
  return (
    <MenuNav>
      <Menu title="Menu">
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Menu>
    </MenuNav>
  );
}
