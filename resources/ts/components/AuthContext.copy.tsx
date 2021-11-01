// import axios from "axios";
// import React, {useState, useEffect, ReactNode, useContext } from "react";

// const AuthContext = React.createContext(false);

// interface Props {
//   children: ReactNode
// }
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// const AuthProvider = ({ children }: Props) => {
//   // const isAuth = () => {
//   //   axios.get('/api/user').then(() => {
//   //     return 'authorized'
//   //   }).catch(() => {
//   //     return 'unauthorized'
//   //   })
//   // }
//   // const value = {
//   //   isAuth,
//   // }
//   const isAuth = useAuthProvider();
//   return <AuthContext.Provider value={isAuth}>{children}</AuthContext.Provider>;
// };

// const useAuthProvider = () => {
//   const [isAuth, setIsAuth] = useState(false)
//   useEffect(() => {
//     axios.get('/api/user').then((user) => {
//       if(user) {
//         setIsAuth(true)
//       } else {
//         setIsAuth(false)
//       }
//     })
//   }, [])
//   return isAuth
// }
// export default AuthProvider;