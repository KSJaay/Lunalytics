# Permissions

We currently have a basic permissions system. Users are able to assign either an admin, editor or guest role. Each role has it's own set of permissions and applies throughout the whole application. The following table outlines the permissions each role has.

| Role   | Description                                                                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner  | All permissions                                                                                                                                                                          |
| Admin  | <ul style="padding:0; margin:0; marginLeft: 10px;"><li>Create, read, update, and delete monitors.</li><li>Change permissions of other users.</li><li>Remove and approve users.</li></ul> |
| Editor | Create, read, update, and delete monitors                                                                                                                                                |
| Guest  | Read monitors                                                                                                                                                                            |

### Future of permissions

Currently roles are pretty basic and limited. Users are currently able to view with any information within the application, in the future I'll be developing a system that allows admins to create their custom roles with specific permissions and limit the amount of access the user has to the application. This is currently not on the roadmap but maybe introduced before the 1.0.0 release.
