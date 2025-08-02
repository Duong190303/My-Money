// import { Button, Text } from "@mantine/core";
// import { Link, useNavigate } from "react-router-dom";
// import { IconChevronRight } from "@tabler/icons-react";
// import { useState, useEffect } from "react";
// import { Avatar, Group, Image } from "@mantine/core";
// import { supabase } from "../supabase"; // Đường dẫn đến tệp supabase.ts
// import { Popover, Paper, Box } from "@mantine/core";
// import { showNotification } from "@mantine/notifications";
// import { Container, Grid, Drawer, Burger } from "@mantine/core";
// export function Header() {
//   if (typeof window === "undefined") return null;
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [userId, setUserId] = useState<string | null>(null);
//   const [opened, setOpened] = useState(false);
//   const [avatar, setAvatar] = useState<string | null>(null); // Thay đổi kiểu dữ liệu của avatar thành string | null
//   const [popoverOpened, setPopoverOpened] = useState(false);
//   const [drawerOpened, setDrawerOpened] = useState(false);
//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error) {
//         console.error("No User!", error.message);
//       } else if (user) {
//         setUserId(user.id);

//         const { data, error } = await supabase
//           .from("users")
//           .select("id, user_name, email, avatar_url")
//           .eq("id", user.id)
//           .single();

//         if (error) {
//           console.error("No User!", error.message);
//         } else if (data) {
//           setUsername(data.user_name || "");
//           setEmail(data.email);
//           setAvatar(
//             data.avatar_url ||
//               "https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
//           ); // Lấy avatar từ bảng users);
//         }
//       } else {
//         setUserId(null);
//         setUsername("");
//         setEmail("");
//         setAvatar(null);
//       }
//     }

//     getCurrentUser();
//   }, []);

//   // Xử lý đăng xuất
//   const handleLogout = async () => {
//     // Đăng xuất khỏi phiên Supabase
//     const { error } = await supabase.auth.signOut();
//     setUserId(null);
//     if (error) {
//       showNotification({
//         title: "Lỗi đăng xuất",
//         message: error.message,
//         color: "red",
//       });
//       return;
//     }

//     // Xóa dữ liệu lưu trữ cục bộ (nếu cần)
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     // Reload toàn bộ trang để reset toàn bộ state, bao gồm useState
//     window.location.reload();
//     navigate("/"); // Chuyển về trang chính
//   };

//   const handleLogin = () => {
//     navigate("/login"); // Chuyển về trang Login
//   };

//   const handleNotifications = (route: string, message: string) => {
//     if (userId) {
//       navigate(route);
//     } else {
//       showNotification({
//         title: "Not logged in",
//         message,
//         color: "red",
//       });
//     }
//   };

//   const handleIncome = () =>
//     handleNotifications("/income", "Please login to access Income");
//   const handleDataReport = () =>
//     handleNotifications("/datareport", "Please login to access Data Report");
//   const handleExpenses = () =>
//     handleNotifications("/expenses", "Please login to access Expenses");
//   return (
//     <Container fluid className="header-background" px="lg" py="sm">
//       <Box className="home-header-container">
//         {/* Logo */}
//           <Image
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
//             className="home-logo"
//             alt="My Money"
//           />

//         {/* Navigation (hidden on mobile) */}
//         <Box className="home-nav-wrapper">
//           <Group
//             className="home-navigation"
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               flexDirection: "row",
//               marginLeft: "18%",
//             }}
//           >
//             <Button
//               className="home-nav-item"
//               variant="white"
//               color="black"
//               size="md"
//               radius="xl"
//               onClick={() => navigate("/")}
//             >
//               HOME
//             </Button>
//             <Button
//               className="home-nav-item"
//               variant="white"
//               color="black"
//               size="md"
//               radius="xl"
//               onClick={handleIncome}
//             >
//               INCOME
//             </Button>
//             <Button
//               className="home-nav-item"
//               variant="white"
//               color="black"
//               size="md"
//               radius="xl"
//               onClick={handleExpenses}
//             >
//               EXPENSES
//             </Button>
//             <Button
//               className="home-nav-item"
//               variant="white"
//               color="black"
//               size="md"
//               radius="xl"
//               onClick={handleDataReport}
//             >
//               DATA REPORT
//             </Button>
//           </Group>
//         </Box>

//         {/* Avatar */}
//         <Grid.Col span="content" className="home-login-container">
//           <Popover
//             width={200}
//             opened={popoverOpened}
//             onChange={setPopoverOpened}
//             position="bottom"
//             withArrow
//             shadow="md"
//           >
//             <Popover.Target>
//               <Avatar
//                 src={avatar}
//                 alt="User Avatar"
//                 color="black"
//                 radius="xl"
//                 onMouseEnter={() => setPopoverOpened(true)}
//                 onMouseLeave={() => setPopoverOpened(false)}
//                 style={{ cursor: "pointer", backgroundColor: "white" }}
//               />
//             </Popover.Target>
//             <Popover.Dropdown
//               onMouseEnter={() => setPopoverOpened(true)}
//               onMouseLeave={() => setPopoverOpened(false)}
//             >
//               {userId ? (
//                 <>
//                   <Paper shadow="sm" radius="md" p="md">
//                     <Group align="bottom-left">
//                       <Avatar src={avatar} radius="xl" size="md" />
//                       <Box>
//                         <Text fw={500} size="sm">
//                           {username || "Loading..."}
//                         </Text>
//                         <Text size="xs" c="dimmed">
//                           {email || "Loading..."}
//                         </Text>
//                       </Box>
//                     </Group>
//                   </Paper>
//                   <Button
//                     variant="subtle"
//                     component={Link}
//                     to="/profile"
//                     fullWidth
//                     mt="sm"
//                   >
//                     Profile{" "}
//                     <IconChevronRight size={16} style={{ marginLeft: 5 }} />
//                   </Button>
//                   <Button
//                     variant="subtle"
//                     onClick={handleLogout}
//                     fullWidth
//                     mt="sm"
//                     style={{ backgroundColor: "red", color: "white" }}
//                   >
//                     Log out
//                   </Button>
//                 </>
//               ) : (
//                 <Button variant="subtle" onClick={handleLogin} fullWidth>
//                   Log in
//                 </Button>
//               )}
//             </Popover.Dropdown>
//           </Popover>
//         </Grid.Col>

//         {/* Hamburger icon (show only on mobile) */}
//         <Grid.Col span="content" className="hamburger-icon">
//           <Burger
//             opened={drawerOpened}
//             onClick={() => setDrawerOpened(true)}
//             color="white"
//           />
//         </Grid.Col>
//       </Box>

//       {/* Drawer for mobile */}
//       <Drawer
//         id="background-drawer"
//         opened={drawerOpened}
//         onClose={() => setDrawerOpened(false)}
//         title="Menu"
//         padding="md"
//         size="80%"
//         position="right"
//         bg={"dark"}
//       >
//         <Button
//           fullWidth
//           variant="light"
//           onClick={() => {
//             navigate("/");
//             setDrawerOpened(false);
//           }}
//         >
//           HOME
//         </Button>
//         <Button
//           fullWidth
//           variant="light"
//           onClick={() => {
//             handleIncome();
//             setDrawerOpened(false);
//           }}
//         >
//           INCOME
//         </Button>
//         <Button
//           fullWidth
//           variant="light"
//           onClick={() => {
//             handleExpenses();
//             setDrawerOpened(false);
//           }}
//         >
//           EXPENSES
//         </Button>
//         <Button
//           fullWidth
//           variant="light"
//           onClick={() => {
//             handleDataReport();
//             setDrawerOpened(false);
//           }}
//         >
//           DATA REPORT
//         </Button>
//       </Drawer>
//     </Container>
//   );
// }
