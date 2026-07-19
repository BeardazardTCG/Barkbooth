/** Routes that belong to the signed-in owner workspace when a viewer is present. */
const ownerRoutePrefixes = ["/account", "/dashboard", "/dogs", "/register-dog"] as const;

export function isOwnerWorkspaceRoute(pathname: string) {
  return ownerRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isNavigationRouteActive(pathname: string, href: string) {
  if (href === "/dogs" || href === "/account") return pathname === href || pathname.startsWith(`${href}/`);
  return pathname === href;
}
