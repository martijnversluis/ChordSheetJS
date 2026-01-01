export interface UserConfigurationProperties {
  name?: string;
  fullname?: string;
}

class UserConfiguration {
  name?: string;

  fullname?: string;

  constructor(userConfiguration: Partial<UserConfigurationProperties> = {}) {
    this.name = userConfiguration.name;
    this.fullname = userConfiguration.fullname;
  }
}

export default UserConfiguration;
