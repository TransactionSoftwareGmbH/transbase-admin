import React from "react";
import {
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  useResourceDefinitions,
  useCreatePath,
  useGetResourceLabel,
  ResourceDefinition,
} from "react-admin";
import {
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  MenuItem,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ViewList from "@mui/icons-material/ViewList";

export function TransbaseAppMenu({ hasDashboard }: MenuProps) {
  const resources = useMenu();
  return (
    <List component="nav">
      {hasDashboard && <DashboardMenuItem />}
      {resources.map((res) =>
        "items" in res ? (
          <MenuGroup key={res.name} {...res} />
        ) : (
          <ResourceMenuItem key={res.name} {...res} />
        )
      )}
    </List>
  );
}

function useMenu() {
  const resources = useResourceDefinitions();
  return Object.values(
    Object.entries(resources).reduce(
      (acc, [key, next]) => {
        if (next.options?.group) {
          acc[next.options?.group] = acc[next.options?.group] || {
            ...next.options,
            name: next.options.group,
            items: [],
          };
          (
            acc[next.options?.group] as { items: ResourceDefinition[] }
          ).items.push(next);
        } else {
          acc[key] = next;
        }
        return acc;
      },
      {} as {
        [resource: string]:
          | ResourceDefinition
          | {
              icon: React.ReactNode;
              name: string;
              items: ResourceDefinition[];
            };
      }
    )
  );
}

function ResourceMenuItem({
  name,
  icon: Icon = ViewList,
  options,
}: ResourceDefinition) {
  const createPath = useCreatePath();
  const getResourceLabel = useGetResourceLabel();
  return (
    <MenuItemLink
      key={name}
      to={createPath({ resource: name, type: "list" })}
      state={{ _scrollToTop: true }}
      primaryText={getResourceLabel(name, options?.singular ? 1 : 2)}
      leftIcon={<Icon />}
    />
  );
}

function MenuGroup({
  items,
  icon: GroupIcon,
  name,
}: {
  items: ResourceDefinition[];
  icon?: any;
  name: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <MenuItem onClick={() => setOpen(!open)}>
        <ListItemIcon>{GroupIcon && <GroupIcon />}</ListItemIcon>
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ marginLeft: "16px" }}>
          {items.map((resource) => (
            <ResourceMenuItem key={resource.name} {...resource} />
          ))}
        </List>
      </Collapse>
    </>
  );
}
