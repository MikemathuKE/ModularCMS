import {
  Navbar,
  NavItem,
  ThemeModeSwitch,
} from "@/components/LayoutComponents";

export default function ExampleNavbar() {
  return (
    <Navbar>
      <ThemeModeSwitch></ThemeModeSwitch>
      <NavItem href={""}>Home</NavItem>
      <NavItem href={""}>About</NavItem>
      <NavItem href={""}>Portfolio</NavItem>
    </Navbar>
  );
}
