import { Navbar, NavItem } from "@/components/LayoutComponents";

export default function ExampleNavbar() {
  return (
    <Navbar>
      <NavItem href={"/Home"}>Home</NavItem>
      <NavItem href={"/About"}>About</NavItem>
    </Navbar>
  );
}
