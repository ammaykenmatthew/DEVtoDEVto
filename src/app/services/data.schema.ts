export interface Users{
    id: number,
    studnum_fld: number,
    fname_fld: string,
    mname_fld: string,
    lname_fld: string,
    extname_fld: string,
    dept_fld: string,
    program_fld: string,
    profilepic_fld: string,
}

export interface LoginUsers{

    email_add: string, //email_add admin-
    pword_fld: string, //password admin-
    role: string, //access
    token: string,
}

export interface Posts{
      id: number,
      user_id: number,

      title: string,
      description: string,
      created_at: string,

}
