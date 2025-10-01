import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// 3h. Om de Context-objecten en createContext niet iedere keer te hoeven importeren
// maken we hier twee custom-hooks aan
export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleMount();
  }, []);

   return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
