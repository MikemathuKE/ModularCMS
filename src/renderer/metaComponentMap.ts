import {
  PageContainer,
  ALink,
  Topbar,
  Main,
  Sidebar,
  Info,
  Footer,
  NavigationDrawer,
  SideNavigation,
  Logo,
  Section,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Grid,
  MenuNav,
  Navbar,
  NavItem,
  Menu,
  MenuList,
  MenuItem,
  TableWrapper,
  PaginationWrapper,
  PageButton,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableData,
  Table,
} from "@/components/LayoutComponents";

import {
  Button,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  Span,
  Text,
  RichText,
} from "@/components/GeneralComponents";

import {
  AudioMedia,
  VideoMedia,
  ImageMedia,
} from "@/components/MediaComponents";

import {
  Form,
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  CheckboxInput,
  RadioInput,
  FileInput,
  DateInput,
  RangeInput,
  SelectInput,
  TextArea,
  FieldWrapper,
  Label,
  FormGroup,
  ErrorText,
  Option,
} from "@/components/FormElements";

import { DataSection } from "@/components/DataSection";

interface ComponentMeta<T> {
  component: React.ComponentType<T>;
  props: Partial<T>;
}

export const MetaComponentMap: Record<string, ComponentMeta<any>> = {
  // Data Components
  DataSection: {
    component: DataSection,
    props: {
      contentType: "",
      filters: {},
      sort: {},
      limit: null,
      paginate: false,
    },
  },
  // Layout Components
  ALink: {
    component: ALink,
    props: {
      href: "",
    },
  },
  PageContainer: {
    component: PageContainer,
    props: {
      id: null,
      style: null,
    },
  },
  Topbar: {
    component: Topbar,
    props: {
      id: null,
      style: null,
      visibility: "visible",
    },
  },
  Main: {
    component: Main,
    props: {
      id: null,
      style: null,
    },
  },
  Sidebar: {
    component: Sidebar,
    props: {
      id: null,
      style: null,

      visibility: "visible",
    },
  },
  Info: {
    component: Info,
    props: {
      id: null,
      style: null,
    },
  },
  Footer: {
    component: Footer,
    props: {
      id: null,
      style: null,
    },
  },
  NavigationDrawer: {
    component: NavigationDrawer,
    props: {
      id: null,
      style: null,

      isOpen: true,
      position: "left",
      title: null,
      toggleSidebar: null, // This should be set in the editor
    },
  },
  SideNavigation: {
    component: SideNavigation,
    props: {
      id: null,
      style: null,

      title: null,
      textColor: null,
    },
  },
  Logo: {
    component: Logo,
    props: {
      id: null,
      style: null,

      showSideBar: false,
      toggleSideBar: null, // Should be set in editor
    },
  },
  Section: {
    component: Section,
    props: {
      id: null,
      style: null,
    },
  },
  Card: {
    component: Card,
    props: {
      id: null,
      style: null,
    },
  },
  CardContent: {
    component: CardContent,
    props: {
      id: null,
      style: null,
    },
  },
  CardHeader: {
    component: CardHeader,
    props: {
      id: null,
      style: null,
    },
  },
  CardFooter: {
    component: CardFooter,
    props: {
      id: null,
      style: null,
    },
  },
  Grid: {
    component: Grid,
    props: {
      id: null,
      style: null,
    },
  },
  MenuNav: {
    component: MenuNav,
    props: {
      id: null,
      style: null,
    },
  },
  Navbar: {
    component: Navbar,
    props: {
      id: null,
      style: null,
    },
  },
  NavItem: {
    component: NavItem,
    props: {
      id: null,
      style: null,

      href: "#", // Required but set to default
    },
  },
  Menu: {
    component: Menu,
    props: {
      id: null,
      style: null,

      title: "Menu", // Required but set to default
    },
  },
  MenuList: {
    component: MenuList,
    props: {
      id: null,
      style: null,

      visible: true,
    },
  },
  MenuItem: {
    component: MenuItem,
    props: {
      id: null,
      style: null,
    },
  },
  TableWrapper: {
    component: TableWrapper,
    props: {
      id: null,
      style: null,
    },
  },
  PaginationWrapper: {
    component: PaginationWrapper,
    props: {
      id: null,
      style: null,
    },
  },
  PageButton: {
    component: PageButton,
    props: {
      id: null,
      style: null,
      disabled: false,
      onClick: null, // Should be set in editor
    },
  },
  TableHead: {
    component: TableHead,
    props: {
      id: null,
      style: null,
    },
  },
  TableBody: {
    component: TableBody,
    props: {
      id: null,
      style: null,
    },
  },
  TableHeader: {
    component: TableHeader,
    props: {
      id: null,
      style: null,
    },
  },
  TableRow: {
    component: TableRow,
    props: {
      id: null,
      style: null,
    },
  },
  TableData: {
    component: TableData,
    props: {
      id: null,
      style: null,
    },
  },
  Table: {
    component: Table,
    props: {
      id: null,
      contentType: "",
      displayColumns: "",
      style: null,

      data: [],
      columns: [],
      currentPage: 1,
      totalPages: 1,
      onPageChange: null, // Should be set in editor
    },
  },

  // General Components
  Button: {
    component: Button,
    props: {
      id: null,
      style: null,
      type: "button",
      disabled: false,
      autoFocus: false,
      name: null,
      value: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: false,
      formTarget: null,
      onClick: null,
      onFocus: null,
      onBlur: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onKeyDown: null,
      onKeyUp: null,
      className: null,
      tabIndex: null,
      title: null,
      role: null,
    },
  },
  Heading1: {
    component: Heading1,
    props: {
      id: null,
      style: null,
    },
  },
  Heading2: {
    component: Heading2,
    props: {
      id: null,
      style: null,
    },
  },
  Heading3: {
    component: Heading3,
    props: {
      id: null,
      style: null,
    },
  },
  Heading4: {
    component: Heading4,
    props: {
      id: null,
      style: null,
    },
  },
  Heading5: {
    component: Heading5,
    props: {
      id: null,
      style: null,
    },
  },
  Heading6: {
    component: Heading6,
    props: {
      id: null,
      style: null,
    },
  },
  Paragraph: {
    component: Paragraph,
    props: {
      id: null,
      style: null,
    },
  },
  Span: {
    component: Span,
    props: {
      id: null,
      style: null,
    },
  },
  Text: {
    component: Text,
    props: {
      text: "Text",
    },
  },
  RichText: {
    component: RichText,
    props: {
      richText: "Text",
    },
  },

  // Media Components
  AudioMedia: {
    component: AudioMedia,
    props: {
      id: null,
      style: null,
      src: "",
      controls: true,
      autoPlay: false,
      loop: false,
      muted: false,
      preload: null,
    },
  },
  VideoMedia: {
    component: VideoMedia,
    props: {
      id: null,
      style: null,
      src: "",
      controls: true,
      width: "100%",
      height: "auto",
      autoPlay: false,
      loop: false,
      muted: false,
      preload: null,
    },
  },
  ImageMedia: {
    component: ImageMedia,
    props: {
      id: null,
      style: null,
      src: null,
      alt: "Image",
      width: 500,
      height: 500,
      layout: "intrinsic",
      objectFit: "cover",
      priority: false,
    },
  },

  // Form Components
  Form: {
    component: Form,
    props: {
      id: null,
      contentType: "",
      formTitle: "",
      style: null,
      action: null,
      method: null,
      encType: null,
      name: null,
      target: null,
      autoComplete: null,
      noValidate: false,
      acceptCharset: null,
      onSubmit: null,
      onReset: null,
      className: null,
      role: null,
      tabIndex: null,
      title: null,
      lang: null,
      dir: null,
      accessKey: null,
    },
  },
  TextInput: {
    component: TextInput,
    props: {
      id: null,
      style: null,
      name: "text-input",
      value: "",
      defaultValue: null,
      placeholder: "Enter text...",
      disabled: false,
      required: false,
      readOnly: false,
      maxLength: null,
      minLength: null,
      onChange: null,
      onBlur: null,
      onFocus: null,
      autoFocus: false,
      autoComplete: null,
      pattern: null,
      inputMode: null,
    },
  },
  EmailInput: {
    component: EmailInput,
    props: {
      id: null,
      style: null,
      name: "email-input",
      value: "",
      defaultValue: null,
      placeholder: "Enter email...",
      disabled: false,
      required: false,
      readOnly: false,
      maxLength: null,
      minLength: null,
      autoComplete: null,
      onChange: null,
    },
  },
  PasswordInput: {
    component: PasswordInput,
    props: {
      id: null,
      style: null,
      name: "password-input",
      value: "",
      defaultValue: null,
      placeholder: "Enter password...",
      required: false,
      maxLength: null,
      minLength: null,
      autoComplete: null,
      onChange: null,
    },
  },
  NumberInput: {
    component: NumberInput,
    props: {
      id: null,
      style: null,
      name: "number-input",
      value: 0,
      defaultValue: null,
      placeholder: "Enter number...",
      min: null,
      max: null,
      step: null,
      required: false,
      onChange: null,
    },
  },
  CheckboxInput: {
    component: CheckboxInput,
    props: {
      id: null,
      style: null,
      name: "checkbox-input",
      checked: false,
      defaultChecked: null,
      required: false,
      disabled: false,
      onChange: null,
    },
  },
  RadioInput: {
    component: RadioInput,
    props: {
      id: null,
      style: null,
      name: "radio-input",
      value: "option",
      checked: false,
      disabled: false,
      required: false,
      onChange: null,
    },
  },
  FileInput: {
    component: FileInput,
    props: {
      id: null,
      style: null,
      name: "file-input",
      multiple: false,
      accept: null,
      required: false,
      disabled: false,
      onChange: null,
    },
  },
  DateInput: {
    component: DateInput,
    props: {
      id: null,
      style: null,
      name: "date-input",
      value: null,
      defaultValue: null,
      required: false,
      min: null,
      max: null,
      disabled: false,
      onChange: null,
    },
  },
  RangeInput: {
    component: RangeInput,
    props: {
      id: null,
      style: null,
      name: "range-input",
      value: 50,
      defaultValue: null,
      min: 0,
      max: 100,
      step: 1,
      required: false,
      disabled: false,
      readOnly: false,
      autoFocus: false,
      tabIndex: null,
      className: null,
      title: null,
      onChange: null,
      onFocus: null,
      onBlur: null,
    },
  },
  SelectInput: {
    component: SelectInput,
    props: {
      id: null,
      style: null,
      name: "select-input",
      value: null,
      required: false,
      multiple: false,
      size: null,
      disabled: false,
      autoFocus: false,
      className: null,
      title: null,
      onChange: null,
      onFocus: null,
      onBlur: null,
    },
  },
  TextArea: {
    component: TextArea,
    props: {
      id: null,
      style: null,
      name: "textarea-input",
      value: "",
      defaultValue: null,
      placeholder: "Enter text...",
      rows: 3,
      cols: null,
      maxLength: null,
      minLength: null,
      required: false,
      disabled: false,
      readOnly: false,
      autoFocus: false,
      wrap: "soft",
      className: null,
      title: null,
      onChange: null,
      onFocus: null,
      onBlur: null,
    },
  },
  FieldWrapper: {
    component: FieldWrapper,
    props: {
      id: null,
      style: null,
      label: null,
      error: null,
    },
  },
  Label: {
    component: Label,
    props: {
      id: null,
      style: null,
      htmlFor: null,
    },
  },
  FormGroup: {
    component: FormGroup,
    props: {
      id: null,
      style: null,
    },
  },
  ErrorText: {
    component: ErrorText,
    props: {
      id: null,
      style: null,
      error: "Error message",
    },
  },
  Option: {
    component: Option,
    props: {
      value: null,
    },
  },
};
