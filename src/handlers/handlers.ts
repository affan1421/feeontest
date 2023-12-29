import { rest } from 'msw'

export const handlers = [
    rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    body: 'This is a body',
                    id: 1,
                    title: 'qui est esse',
                    userId: 1,
                },
            ])
        )
    }),
    rest.post('https://api.growon.app/api/v1/SignUp/login', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "status": 200,
                    "message": "Auth successful",
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDMxMzA1ZWEwZWFhMGJjM2U2MjU1NSIsImlhdCI6MTY3ODQ0MDQ5OCwiZXhwIjoxNjgzNjI0NDk4fQ.TN__yvS_IMed2xwD3DxPBMnH1Xv23eKtrzZCmRtXdSo",
                    "user_info": [
                        {
                            "rewards": {
                                "coins": 0,
                                "dailyCoins": 5,
                                "date": "2022-11-17T18:30:00.000Z",
                                "isClaimed": false
                            },
                            "attendanceStats": {
                                "present": 3
                            },
                            "activeStatus": true,
                            "deleted": false,
                            "profileStatus": "APPROVED",
                            "coin": 0,
                            "permissions": {
                                "can_send_announcement_sms": false
                            },
                            "secondary_profile_type": [],
                            "branch_id": null,
                            "primary_class": null,
                            "primary_section": null,
                            "authorized": null,
                            "subject": [],
                            "city": "60fbda40d4fbdfe05d23e6d4",
                            "state": "60fbda3fd4fbdfe05d23e67a",
                            "country": "60b499b8cca795cf59c4bc1b",
                            "other_degrees": [],
                            "certifications": [],
                            "extra_achievement": [],
                            "_id": "62431305ea0eaa0bc3e62555",
                            "secondary_class": null,
                            "username": "7022444444",
                            "name": "admin",
                            "mobile": 7022444444,
                            "isSubmitForm": true,
                            "profile_type": {
                                "_id": "5fd1c4f6ba54044664ff8c0d",
                                "role_name": "school_admin",
                                "display_name": "school Admin",
                                "privilege": {
                                    "add_class": true,
                                    "add_board": true,
                                    "create_question": true,
                                    "create_question_paper": true,
                                    "view_question_paper": true,
                                    "add_syllubus": true,
                                    "add_subject": true,
                                    "add_chapter": true,
                                    "add_topic": true,
                                    "add_learning_outcome": true,
                                    "add_question_category": true,
                                    "add_exam_types": true,
                                    "add_qa": true,
                                    "add_assessment": true,
                                    "create_school": false,
                                    "create_student": true,
                                    "create_teacher": true,
                                    "create_principle": true,
                                    "create_management": true,
                                    "add_mapping": true,
                                    "add_section": true
                                }
                            },
                            "school_id": "62431305ea0eaa0bc3e6254f",
                            "designation": null,
                            "password": "$2b$10$bVdlbNnKRTDdkJVUgfdqy.HvAYfuJQOHtwTNE/OXOk.SDLqm7kMhS",
                            "pin": 9071,
                            "email": "test@gmail.com",
                            "repository": [],
                            "createdAt": "2022-03-29T14:09:09.582Z",
                            "updatedAt": "2022-03-29T14:09:09.582Z",
                            "__v": 0,
                            "aadhar_card": null,
                            "address": "",
                            "blood_gr": "AB+",
                            "caste": "Suni",
                            "createdBy": null,
                            "cv": null,
                            "dob": "2022-04-01T18:30:00.000Z",
                            "experience": null,
                            "gender": "Female",
                            "graduation_details": {
                                "school": "",
                                "Board": "",
                                "percentage": null,
                                "year_of_passing": null
                            },
                            "leaderShip_Exp": null,
                            "level": null,
                            "marital_status": "Married",
                            "masters_details": {
                                "school": "",
                                "Board": "",
                                "percentage": null,
                                "year_of_passing": null
                            },
                            "mother_tounge": "Urdu",
                            "pincode": 560045,
                            "profile_image": null,
                            "qualification": "",
                            "religion": "Islam",
                            "ten_details": {
                                "school": "",
                                "Board": "",
                                "percentage": null,
                                "year_of_passing": null
                            },
                            "twelve_details": {
                                "school": "",
                                "Board": "",
                                "percentage": null,
                                "year_of_passing": null
                            },
                            "updatedBy": null,
                            "DeviceToken": "c4RaNmQdTyOAtellSoE5e5:APA91bFw_VKF_oZhvi4w4yoNr-2YsmgUFPlE0zpyRXTI1AQ8bWQS0K5Uj6qYTYunh2gNp3J3irc-Q7ELVO4V-1jWrepkiPxmgjYPkpkxA-vGLqGIx6mQpc3tSzVgiWtfIwXTXVV_Vpzb",
                            "role": {
                                "_id": "5fd1c4f6ba54044664ff8c0d",
                                "role_name": "school_admin",
                                "display_name": "school Admin",
                                "privilege": {
                                    "add_class": true,
                                    "add_board": true,
                                    "create_question": true,
                                    "create_question_paper": true,
                                    "view_question_paper": true,
                                    "add_syllubus": true,
                                    "add_subject": true,
                                    "add_chapter": true,
                                    "add_topic": true,
                                    "add_learning_outcome": true,
                                    "add_question_category": true,
                                    "add_exam_types": true,
                                    "add_qa": true,
                                    "add_assessment": true,
                                    "create_school": false,
                                    "create_student": true,
                                    "create_teacher": true,
                                    "create_principle": true,
                                    "create_management": true,
                                    "add_mapping": true,
                                    "add_section": true
                                }
                            },
                            "age": 0,
                            "experience_list": null,
                            "other_education": null,
                            "esi_number": null,
                            "pf_number": null,
                            "school_details": [
                                {
                                    "schoolImage": "https://grow-on-prod.s3.ap-south-1.amazonaws.com/164752269481616448498692661629727353615Master%20Growon%20Logo%202020%20Final%201024%20x%201024%20Pixal_A.png",
                                    "_id": "62431305ea0eaa0bc3e6254f",
                                    "schoolName": "School of growOn",
                                    "school_code": 1102
                                }
                            ],
                            "school_code": 1102
                        }
                    ]
                }
            ])
        )
    }),

    rest.get('http://65.2.123.21:3000/api/v1/feetype', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "success": true,
                "data": [
                    {
                        "_id": "640edc8622748a2c59644cac",
                        "feeType": "Tution Fee",
                        "description": "Tution Fee",
                        "accountType": "Revenue",
                        "schoolId": "6233335feec609c379b97b7c",
                        "createdAt": "2023-03-13T08:19:18.118Z",
                        "updatedAt": "2023-03-14T05:50:22.479Z",
                        "__v": 0
                    },
                    {
                        "_id": "640ede7622748a2c59644cc0",
                        "feeType": "Library Fee",
                        "description": "Library Fee",
                        "accountType": "Cash",
                        "schoolId": "6233335feec609c379b97b7c",
                        "createdAt": "2023-03-13T08:27:34.299Z",
                        "updatedAt": "2023-03-13T11:57:33.098Z",
                        "__v": 0
                    },
                    {
                        "_id": "640edeae22748a2c59644cc5",
                        "feeType": "Admission Fee",
                        "description": "Admission Fee",
                        "accountType": "Current",
                        "schoolId": "6233335feec609c379b97b7c",
                        "createdAt": "2023-03-13T08:28:30.728Z",
                        "updatedAt": "2023-03-13T08:28:30.728Z",
                        "__v": 0
                    },
                    {
                        "_id": "640ee62b22748a2c59644ce0",
                        "feeType": "Uniform Fee",
                        "description": "Uniform Fee",
                        "accountType": "Cash",
                        "schoolId": "6233335feec609c379b97b7c",
                        "createdAt": "2023-03-13T09:00:27.875Z",
                        "updatedAt": "2023-03-13T10:36:51.822Z",
                        "__v": 0
                    },
                    {
                        "_id": "640efdbca37db26999374db9",
                        "feeType": "Term Fees",
                        "description": "Term Fees",
                        "accountType": "Debits",
                        "schoolId": "6233335feec609c379b97b7c",
                        "createdAt": "2023-03-13T10:41:00.367Z",
                        "updatedAt": "2023-03-13T11:57:45.723Z",
                        "__v": 0
                    }
                ],
                "resultCount": 9,
                "message": "Fetched Successfully"
            })
        )
    }),

    rest.post('http://65.2.123.21:3000/api/v1/feetype', (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json(
                {
                    "success": true,
                    "data": {
                        "feeType": "dadfac",
                        "description": "dfacvcx",
                        "accountType": "FixedDeposit",
                        "schoolId": "6233335feec609c379b97b7c",
                        "_id": "6410668832c35f423b54b97e",
                        "createdAt": "2023-03-14T12:20:24.569Z",
                        "updatedAt": "2023-03-14T12:20:24.569Z",
                        "__v": 0
                    },
                    "resultCount": 1,
                    "message": "Created Successfully"
                }
            )
        )
    })
]
