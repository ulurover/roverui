import { useState } from "react";
import {
  createStyles,
  Header as HeaderMantine,
  Container,
  Group,
  Burger,
  Text,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface HeaderProps {
  links: { link: string; label: string }[];
  mode: {
    communicationMode: string;
    setCommunicationMode: React.Dispatch<
      React.SetStateAction<"serial" | "webusb">
    >;
  };
}

export default function Header({ links, mode }: HeaderProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const { communicationMode, setCommunicationMode } = mode;

  const changeMode = (value: string) => {
    if (value === "serial" || value === "webusb") {
      setCommunicationMode(value);
    }
  };

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <HeaderMantine height={60} mb={120}>
      <Container className={classes.header}>
        <Text>Ulurover UI</Text>
        <SegmentedControl
          value={communicationMode}
          onChange={changeMode}
          data={[
            { label: "WebSerial API", value: "serial" },
            { label: "WebUSB API", value: "webusb" },
          ]}
        />

        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </HeaderMantine>
  );
}
