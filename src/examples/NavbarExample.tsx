import { Navbar, NavItem } from "@/components/LayoutComponents";

export default function ExampleNavbar() {
  return (
    <Navbar>
      <NavItem href={"/home"}>Home</NavItem>
      <NavItem href={"/about"}>About</NavItem>
      <NavItem href={"/portfolio"}>Portfolio</NavItem>
    </Navbar>
  );
}
