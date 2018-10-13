const authFunction = {
    isAuthenticated: false,
    authenticate(setNewState) {
      this.isAuthenticated = true;
      setNewState();
    },
    signout(historyBack) {
      this.isAuthenticated = false;
      historyBack();
    }
};

export { authFunction }

