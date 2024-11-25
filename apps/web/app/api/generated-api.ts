/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterBody {
  /** @format email */
  email: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  firstName: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  lastName: string;
  /**
   * @minLength 8
   * @maxLength 64
   */
  password: string;
}

export interface RegisterResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export interface LoginBody {
  /** @format email */
  email: string;
  /**
   * @minLength 8
   * @maxLength 64
   */
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export type LogoutResponse = null;

export type RefreshTokensResponse = null;

export interface CurrentUserResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export interface ForgotPasswordBody {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface CreatePasswordBody {
  /**
   * @minLength 8
   * @maxLength 64
   */
  password: string;
  /** @minLength 1 */
  createToken: string;
}

export interface ResetPasswordBody {
  /**
   * @minLength 8
   * @maxLength 64
   */
  newPassword: string;
  /** @minLength 1 */
  resetToken: string;
}

export interface GetUsersResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetUserByIdResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export interface GetUserDetailsResponse {
  data: {
    /** @format uuid */
    id: string;
    description: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    jobTitle: string | null;
  };
}

export interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  /** @format email */
  email?: string;
  role?: "admin" | "student" | "tutor";
  archived?: boolean;
}

export interface UpdateUserResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export interface UpsertUserDetailsBody {
  description?: string;
  /** @format email */
  contactEmail?: string;
  contactPhoneNumber?: string;
  jobTitle?: string;
}

export interface UpsertUserDetailsResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface AdminUpdateUserBody {
  firstName?: string;
  lastName?: string;
  /** @format email */
  email?: string;
  role?: "admin" | "student" | "tutor";
  archived?: boolean;
}

export interface AdminUpdateUserResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    archived: boolean;
  };
}

export interface ChangePasswordBody {
  /**
   * @minLength 8
   * @maxLength 64
   */
  newPassword: string;
  /**
   * @minLength 8
   * @maxLength 64
   */
  oldPassword: string;
}

export type ChangePasswordResponse = null;

export type DeleteUserResponse = null;

export interface DeleteBulkUsersBody {
  userIds: string[];
}

export type DeleteBulkUsersResponse = null;

export interface CreateUserBody {
  /** @format email */
  email: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  firstName: string;
  /**
   * @minLength 1
   * @maxLength 64
   */
  lastName: string;
  role: "admin" | "student" | "tutor";
}

export interface CreateUserResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface GetAllCategoriesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    archived: boolean | null;
    createdAt: string | null;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetCategoryByIdResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    archived: boolean | null;
    createdAt: string | null;
  };
}

export interface CreateCategoryBody {
  title: string;
}

export interface CreateCategoryResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface UpdateCategoryBody {
  /** @format uuid */
  id?: string;
  title?: string;
  archived?: boolean;
}

export interface UpdateCategoryResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    archived: boolean | null;
    createdAt: string | null;
  };
}

export interface GetAllCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseLessonCount: number;
    completedLessonCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    state?: string;
    archived?: boolean;
    createdAt?: string;
    hasFreeLessons?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetStudentCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseLessonCount: number;
    completedLessonCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    state?: string;
    archived?: boolean;
    createdAt?: string;
    hasFreeLessons?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetAvailableCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseLessonCount: number;
    completedLessonCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    state?: string;
    archived?: boolean;
    createdAt?: string;
    hasFreeLessons?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetTutorCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseLessonCount: number;
    completedLessonCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    state?: string;
    archived?: boolean;
    createdAt?: string;
    hasFreeLessons?: boolean;
  }[];
}

export interface GetCourseResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl?: string;
    description: string;
    category: string;
    /** @format uuid */
    categoryId?: string;
    /** @format uuid */
    authorId?: string;
    author?: string;
    authorEmail?: string;
    courseLessonCount: number;
    completedLessonCount?: number;
    enrolled?: boolean;
    state: string | null;
    lessons: {
      /** @format uuid */
      id: string;
      title: string;
      imageUrl?: string;
      description: string;
      itemsCount: number;
      itemsCompletedCount?: number;
      lessonProgress?: "completed" | "in_progress" | "not_started";
      isFree?: boolean;
      enrolled?: boolean;
      state?: string;
      archived?: boolean;
      isSubmitted?: boolean;
      type?: string;
      createdAt?: string;
      quizScore?: number;
    }[];
    priceInCents: number;
    currency: string;
    archived?: boolean;
    hasFreeLessons?: boolean;
  };
}

export interface GetCourseByIdResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl?: string;
    description: string;
    category: string;
    /** @format uuid */
    categoryId?: string;
    /** @format uuid */
    authorId?: string;
    author?: string;
    authorEmail?: string;
    courseLessonCount: number;
    completedLessonCount?: number;
    enrolled?: boolean;
    state: string | null;
    lessons: {
      /** @format uuid */
      id: string;
      title: string;
      imageUrl?: string;
      description: string;
      itemsCount: number;
      itemsCompletedCount?: number;
      lessonProgress?: "completed" | "in_progress" | "not_started";
      isFree?: boolean;
      enrolled?: boolean;
      state?: string;
      archived?: boolean;
      isSubmitted?: boolean;
      type?: string;
      createdAt?: string;
      quizScore?: number;
    }[];
    priceInCents: number;
    currency: string;
    archived?: boolean;
    hasFreeLessons?: boolean;
  };
}

export type CreateCourseBody = {
  title: string;
  description: string;
  state: "draft" | "published";
  imageUrl?: string;
  priceInCents?: number;
  currency?: string;
  /** @format uuid */
  categoryId: string;
} & {
  lessons?: string[];
};

export interface CreateCourseResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface UpdateCourseBody {
  title?: string;
  description?: string;
  imageUrl?: string;
  state?: "draft" | "published";
  priceInCents?: number;
  currency?: string;
  /** @format uuid */
  categoryId?: string;
  lessons?: string[];
  archived?: boolean;
}

export interface UpdateCourseResponse {
  data: {
    message: string;
  };
}

export interface EnrollCourseResponse {
  data: {
    message: string;
  };
}

export type UnenrollCourseResponse = null;

export interface GetAllLessonsResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl?: string;
    description: string;
    itemsCount: number;
    itemsCompletedCount?: number;
    lessonProgress?: "completed" | "in_progress" | "not_started";
    isFree?: boolean;
    enrolled?: boolean;
    state?: string;
    archived?: boolean;
    isSubmitted?: boolean;
    type?: string;
    createdAt?: string;
    quizScore?: number;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetAvailableLessonsResponse {
  data: ({
    /** @format uuid */
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    isFree: boolean;
  } & {
    itemsCount: number;
  })[];
}

export interface GetLessonResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl?: string;
    description: string;
    itemsCount: number;
    itemsCompletedCount?: number;
    lessonProgress?: "completed" | "in_progress" | "not_started";
    isFree?: boolean;
    enrolled?: boolean;
    state?: string;
    archived?: boolean;
    isSubmitted?: boolean;
    type?: string;
    createdAt?: string;
    quizScore?: number;
    lessonItems: {
      /** @format uuid */
      lessonItemId: string;
      lessonItemType: string;
      displayOrder: number | null;
      passQuestion?: null;
      content:
        | {
            /** @format uuid */
            id: string;
            questionType: string;
            questionBody: string;
            questionAnswers: {
              /** @format uuid */
              id: string;
              optionText: string;
              position: number | null;
              isStudentAnswer?: boolean | null;
              isCorrect?: boolean | null;
              studentAnswerText?: string | null;
            }[];
            solutionExplanation?: string | null;
            passQuestion?: boolean | null;
          }
        | {
            /** @format uuid */
            id: string;
            title: string;
            body: string;
            state: string;
          }
        | {
            /** @format uuid */
            id: string;
            title: string;
            type: string;
            url: string;
          };
    }[];
  };
}

export interface GetLessonByIdResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    imageUrl?: string;
    description: string;
    itemsCount: number;
    itemsCompletedCount?: number;
    lessonProgress?: "completed" | "in_progress" | "not_started";
    isFree?: boolean;
    enrolled?: boolean;
    state?: string;
    archived?: boolean;
    isSubmitted?: boolean;
    type?: string;
    createdAt?: string;
    quizScore?: number;
    lessonItems: {
      /** @format uuid */
      lessonItemId: string;
      lessonItemType: string;
      displayOrder: number | null;
      passQuestion?: null;
      content:
        | {
            /** @format uuid */
            id: string;
            questionType: string;
            questionBody: string;
            questionAnswers: {
              /** @format uuid */
              id: string;
              optionText: string;
              position: number | null;
              isStudentAnswer?: boolean | null;
              isCorrect?: boolean | null;
              studentAnswerText?: string | null;
            }[];
            solutionExplanation?: string | null;
            passQuestion?: boolean | null;
          }
        | {
            /** @format uuid */
            id: string;
            title: string;
            body: string;
            state: string;
          }
        | {
            /** @format uuid */
            id: string;
            title: string;
            type: string;
            url: string;
          };
    }[];
  };
}

export interface CreateLessonBody {
  title: string;
  imageUrl?: string;
  description: string;
  lessonProgress?: "completed" | "in_progress" | "not_started";
  isFree?: boolean;
  enrolled?: boolean;
  state?: string;
  archived?: boolean;
  isSubmitted?: boolean;
  type?: string;
  createdAt?: string;
  quizScore?: number;
}

export interface CreateLessonResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface UpdateLessonBody {
  title?: string;
  imageUrl?: string;
  description?: string;
  lessonProgress?: "completed" | "in_progress" | "not_started";
  isFree?: boolean;
  enrolled?: boolean;
  state?: string;
  archived?: boolean;
  isSubmitted?: boolean;
  type?: string;
  createdAt?: string;
  quizScore?: number;
}

export interface UpdateLessonResponse {
  data: {
    message: string;
  };
}

export interface AddLessonToCourseBody {
  /** @format uuid */
  courseId: string;
  /** @format uuid */
  lessonId: string;
  displayOrder?: number;
}

export interface AddLessonToCourseResponse {
  data: {
    message: string;
  };
}

export interface RemoveLessonFromCourseResponse {
  data: {
    message: string;
  };
}

export interface ToggleLessonAsFreeBody {
  /** @format uuid */
  courseId: string;
  /** @format uuid */
  lessonId: string;
  isFree: boolean;
}

export interface ToggleLessonAsFreeResponse {
  data: {
    isFree: boolean;
    message: string;
  };
}

export interface EvaluationQuizResponse {
  data: {
    message: string;
  };
}

export interface ClearQuizProgressResponse {
  data: {
    message: string;
  };
}

export interface GetAllLessonItemsResponse {
  data: (
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "question";
        questionType: string;
        questionBody: string;
        solutionExplanation: string | null;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "file";
        title: string;
        url: string;
        type: string;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "text_block";
        title: string;
        body: string | null;
      })
  )[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
}

export interface GetAvailableLessonItemsResponse {
  data: (
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "question";
        questionType: string;
        questionBody: string;
        solutionExplanation: string | null;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "file";
        title: string;
        url: string;
        type: string;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "text_block";
        title: string;
        body: string | null;
      })
  )[];
}

export interface GetLessonItemByIdResponse {
  data:
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "question";
        questionType: string;
        questionBody: string;
        solutionExplanation: string | null;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "file";
        title: string;
        url: string;
        type: string;
      })
    | ({
        id: string;
        state: string;
        archived: boolean;
        authorId: string;
        createdAt: string;
        updatedAt: string;
      } & {
        itemType: "text_block";
        title: string;
        body: string | null;
      });
}

export interface AssignItemsToLessonBody {
  items: {
    /** @format uuid */
    id: string;
    type: "text_block" | "file" | "question";
  }[];
}

export interface AssignItemsToLessonResponse {
  data: {
    message: string;
  };
}

export interface UnassignItemsFromLessonBody {
  items: {
    /** @format uuid */
    id: string;
    type: "text_block" | "file" | "question";
  }[];
}

export interface UnassignItemsFromLessonResponse {
  data: {
    message: string;
  };
}

export interface UpdateTextBlockItemBody {
  title?: string;
  body?: string | null;
  state?: string;
  archived?: boolean;
  /** @format uuid */
  authorId?: string;
}

export interface UpdateTextBlockItemResponse {
  data: {
    message: string;
  };
}

export interface UpdateQuestionItemBody {
  questionType?: string;
  questionBody?: string;
  solutionExplanation?: string | null;
  state?: string;
  questionAnswers?: {
    /** @format uuid */
    id?: string;
    optionText: string;
    position: number | null;
    isStudentAnswer?: boolean;
    isCorrect?: boolean;
    /** @format uuid */
    questionId: string;
  }[];
  archived?: boolean;
}

export interface UpdateQuestionItemResponse {
  data: {
    message: string;
  };
}

export interface UpdateFileItemBody {
  title?: string;
  type?: string;
  url?: string;
  /** @format uuid */
  authorId?: string;
  state?: string;
  archived?: boolean;
}

export interface UpdateFileItemResponse {
  data: {
    message: string;
  };
}

export interface CreateTextBlockBody {
  title: string;
  body: string;
  state: string;
  /** @format uuid */
  authorId: string;
}

export interface CreateTextBlockResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface CreateQuestionBody {
  questionType: string;
  questionBody: string;
  state: string;
  /** @format uuid */
  authorId: string;
  solutionExplanation?: string;
}

export interface CreateQuestionResponse {
  data: {
    message: string;
    /** @format uuid */
    questionId: string;
  };
}

export interface GetQuestionAnswersResponse {
  data: {
    /** @format uuid */
    id: string;
    optionText: string;
    isCorrect: boolean;
    position: number | null;
  }[];
}

export type UpsertQuestionOptionsBody = {
  /** @format uuid */
  id?: string;
  optionText?: string;
  isCorrect?: boolean;
  position?: number;
}[];

export interface UpsertQuestionOptionsResponse {
  data: {
    message: string;
  };
}

export interface CreateFileBody {
  title: string;
  type: string;
  url: string;
  state: string;
  /** @format uuid */
  authorId: string;
}

export interface CreateFileResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface AnswerQuestionBody {
  /** @format uuid */
  courseId: string;
  /** @format uuid */
  lessonId: string;
  /** @format uuid */
  questionId: string;
  answer:
    | string[]
    | string
    | {
        index: number;
        value: string;
      }[];
}

export interface AnswerQuestionResponse {
  data: {
    message: string;
  };
}

export interface MarkLessonItemAsCompletedResponse {
  data: {
    message: string;
  };
}

export interface FileUploadResponse {
  fileKey: string;
  fileUrl: string;
}

export interface CreatePaymentIntentResponse {
  data: {
    clientSecret: string;
  };
}

export interface GetUserStatisticsResponse {
  data: {
    quizzes: {
      totalAttempts: number;
      totalCorrectAnswers: number;
      totalWrongAnswers: number;
      totalQuestions: number;
      averageScore: number;
      uniqueQuizzesTaken: number;
    };
    courses: object;
    lessons: object;
    streak: {
      current: number;
      longest: number;
      activityHistory: object;
    };
  };
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Guidebook API
 * @version 1.0
 * @contact
 *
 * Example usage of Swagger with Typebox
 */
export class API<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name AuthControllerRegister
     * @request POST:/api/auth/register
     */
    authControllerRegister: (data: RegisterBody, params: RequestParams = {}) =>
      this.request<RegisterResponse, any>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogin
     * @request POST:/api/auth/login
     */
    authControllerLogin: (data: LoginBody, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogout
     * @request POST:/api/auth/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<LogoutResponse, any>({
        path: `/api/auth/logout`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerRefreshTokens
     * @request POST:/api/auth/refresh
     */
    authControllerRefreshTokens: (params: RequestParams = {}) =>
      this.request<RefreshTokensResponse, any>({
        path: `/api/auth/refresh`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerCurrentUser
     * @request GET:/api/auth/current-user
     */
    authControllerCurrentUser: (params: RequestParams = {}) =>
      this.request<CurrentUserResponse, any>({
        path: `/api/auth/current-user`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerForgotPassword
     * @request POST:/api/auth/forgot-password
     */
    authControllerForgotPassword: (data: ForgotPasswordBody, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerCreatePassword
     * @request POST:/api/auth/create-password
     */
    authControllerCreatePassword: (data: CreatePasswordBody, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/create-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerResetPassword
     * @request POST:/api/auth/reset-password
     */
    authControllerResetPassword: (data: ResetPasswordBody, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name HealthControllerCheck
     * @request GET:/api/healthcheck
     */
    healthControllerCheck: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {} */
          error?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"}} */
          details?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
        },
        {
          /** @example "error" */
          status?: string;
          /** @example {"database":{"status":"up"}} */
          info?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"redis":{"status":"down","message":"Could not connect"}} */
          error?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
          /** @example {"database":{"status":"up"},"redis":{"status":"down","message":"Could not connect"}} */
          details?: Record<
            string,
            {
              status: string;
              [key: string]: any;
            }
          >;
        }
      >({
        path: `/api/healthcheck`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetUsers
     * @request GET:/api/users
     */
    usersControllerGetUsers: (
      query?: {
        keyword?: string;
        role?: string;
        archived?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetUsersResponse, any>({
        path: `/api/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerUpdateUser
     * @request PATCH:/api/users
     */
    usersControllerUpdateUser: (
      query: {
        /** @format uuid */
        id: string;
      },
      data: UpdateUserBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateUserResponse, any>({
        path: `/api/users`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerDeleteBulkUsers
     * @request DELETE:/api/users
     */
    usersControllerDeleteBulkUsers: (data: DeleteBulkUsersBody, params: RequestParams = {}) =>
      this.request<DeleteBulkUsersResponse, any>({
        path: `/api/users`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetUserById
     * @request GET:/api/users/user
     */
    usersControllerGetUserById: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetUserByIdResponse, any>({
        path: `/api/users/user`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerDeleteUser
     * @request DELETE:/api/users/user
     */
    usersControllerDeleteUser: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DeleteUserResponse, any>({
        path: `/api/users/user`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetUserDetails
     * @request GET:/api/users/user-details
     */
    usersControllerGetUserDetails: (
      query: {
        /** @format uuid */
        userId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetUserDetailsResponse, any>({
        path: `/api/users/user-details`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerUpsertUserDetails
     * @request PATCH:/api/users/user-details
     */
    usersControllerUpsertUserDetails: (data: UpsertUserDetailsBody, params: RequestParams = {}) =>
      this.request<UpsertUserDetailsResponse, any>({
        path: `/api/users/user-details`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerAdminUpdateUser
     * @request PATCH:/api/users/admin/user
     */
    usersControllerAdminUpdateUser: (
      query: {
        /** @format uuid */
        id: string;
      },
      data: AdminUpdateUserBody,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateUserResponse, any>({
        path: `/api/users/admin/user`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerChangePassword
     * @request PATCH:/api/users/change-password
     */
    usersControllerChangePassword: (
      query: {
        /** @format uuid */
        id: string;
      },
      data: ChangePasswordBody,
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordResponse, any>({
        path: `/api/users/change-password`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerCreateUser
     * @request POST:/api/users/create
     */
    usersControllerCreateUser: (data: CreateUserBody, params: RequestParams = {}) =>
      this.request<CreateUserResponse, any>({
        path: `/api/users/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name TestConfigControllerSetup
     * @request POST:/api/test-config/setup
     */
    testConfigControllerSetup: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/test-config/setup`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name TestConfigControllerTeardown
     * @request POST:/api/test-config/teardown
     */
    testConfigControllerTeardown: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/test-config/teardown`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoriesControllerGetAllCategories
     * @request GET:/api/categories
     */
    categoriesControllerGetAllCategories: (
      query?: {
        title?: string;
        archived?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?: "title" | "creationDate" | "-title" | "-creationDate";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllCategoriesResponse, any>({
        path: `/api/categories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoriesControllerCreateCategory
     * @request POST:/api/categories
     */
    categoriesControllerCreateCategory: (data: CreateCategoryBody, params: RequestParams = {}) =>
      this.request<CreateCategoryResponse, any>({
        path: `/api/categories`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoriesControllerGetCategoryById
     * @request GET:/api/categories/{id}
     */
    categoriesControllerGetCategoryById: (id: string, params: RequestParams = {}) =>
      this.request<GetCategoryByIdResponse, any>({
        path: `/api/categories/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoriesControllerUpdateCategory
     * @request PATCH:/api/categories/{id}
     */
    categoriesControllerUpdateCategory: (
      id: string,
      data: UpdateCategoryBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCategoryResponse, any>({
        path: `/api/categories/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetAllCourses
     * @request GET:/api/courses
     */
    coursesControllerGetAllCourses: (
      query?: {
        title?: string;
        category?: string;
        author?: string;
        "creationDateRange[0]"?: string;
        "creationDateRange[1]"?: string;
        state?: string;
        archived?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "lessonsCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-lessonsCount"
          | "-enrolledParticipantsCount";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllCoursesResponse, any>({
        path: `/api/courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerCreateCourse
     * @request POST:/api/courses
     */
    coursesControllerCreateCourse: (data: CreateCourseBody, params: RequestParams = {}) =>
      this.request<CreateCourseResponse, any>({
        path: `/api/courses`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetStudentCourses
     * @request GET:/api/courses/get-student-courses
     */
    coursesControllerGetStudentCourses: (
      query?: {
        title?: string;
        category?: string;
        author?: string;
        "creationDateRange[0]"?: string;
        "creationDateRange[1]"?: string;
        state?: string;
        archived?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "lessonsCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-lessonsCount"
          | "-enrolledParticipantsCount";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetStudentCoursesResponse, any>({
        path: `/api/courses/get-student-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetAvailableCourses
     * @request GET:/api/courses/available-courses
     */
    coursesControllerGetAvailableCourses: (
      query?: {
        title?: string;
        category?: string;
        author?: string;
        "creationDateRange[0]"?: string;
        "creationDateRange[1]"?: string;
        state?: string;
        archived?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "lessonsCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-lessonsCount"
          | "-enrolledParticipantsCount";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAvailableCoursesResponse, any>({
        path: `/api/courses/available-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetTutorCourses
     * @request GET:/api/courses/tutor-courses
     */
    coursesControllerGetTutorCourses: (
      query: {
        /** @format uuid */
        authorId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTutorCoursesResponse, any>({
        path: `/api/courses/tutor-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetCourse
     * @request GET:/api/courses/course
     */
    coursesControllerGetCourse: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseResponse, any>({
        path: `/api/courses/course`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerGetCourseById
     * @request GET:/api/courses/course-by-id
     */
    coursesControllerGetCourseById: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseByIdResponse, any>({
        path: `/api/courses/course-by-id`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerUpdateCourse
     * @request PATCH:/api/courses/{id}
     */
    coursesControllerUpdateCourse: (
      id: string,
      data: UpdateCourseBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCourseResponse, any>({
        path: `/api/courses/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerEnrollCourse
     * @request POST:/api/courses/enroll-course
     */
    coursesControllerEnrollCourse: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EnrollCourseResponse, any>({
        path: `/api/courses/enroll-course`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoursesControllerUnenrollCourse
     * @request DELETE:/api/courses/unenroll-course
     */
    coursesControllerUnenrollCourse: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UnenrollCourseResponse, any>({
        path: `/api/courses/unenroll-course`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetAllLessons
     * @request GET:/api/lessons
     */
    lessonsControllerGetAllLessons: (
      query?: {
        title?: string;
        state?: string;
        sort?:
          | "title"
          | "createdAt"
          | "state"
          | "itemsCount"
          | "-title"
          | "-createdAt"
          | "-state"
          | "-itemsCount";
        /** @min 1 */
        page?: number;
        perPage?: number;
        archived?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllLessonsResponse, any>({
        path: `/api/lessons`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetAvailableLessons
     * @request GET:/api/lessons/available-lessons
     */
    lessonsControllerGetAvailableLessons: (
      query: {
        /** @format uuid */
        courseId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAvailableLessonsResponse, any>({
        path: `/api/lessons/available-lessons`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetLesson
     * @request GET:/api/lessons/lesson
     */
    lessonsControllerGetLesson: (
      query: {
        /** @format uuid */
        id: string;
        /** @format uuid */
        courseId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLessonResponse, any>({
        path: `/api/lessons/lesson`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUpdateLesson
     * @request PATCH:/api/lessons/lesson
     */
    lessonsControllerUpdateLesson: (
      data: UpdateLessonBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateLessonResponse, any>({
        path: `/api/lessons/lesson`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetLessonById
     * @request GET:/api/lessons/lesson/{id}
     */
    lessonsControllerGetLessonById: (id: string, params: RequestParams = {}) =>
      this.request<GetLessonByIdResponse, any>({
        path: `/api/lessons/lesson/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerCreateLesson
     * @request POST:/api/lessons/create-lesson
     */
    lessonsControllerCreateLesson: (data: CreateLessonBody, params: RequestParams = {}) =>
      this.request<CreateLessonResponse, any>({
        path: `/api/lessons/create-lesson`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerAddLessonToCourse
     * @request POST:/api/lessons/add
     */
    lessonsControllerAddLessonToCourse: (data: AddLessonToCourseBody, params: RequestParams = {}) =>
      this.request<AddLessonToCourseResponse, any>({
        path: `/api/lessons/add`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerRemoveLessonFromCourse
     * @request DELETE:/api/lessons/{courseId}/{lessonId}
     */
    lessonsControllerRemoveLessonFromCourse: (
      courseId: string,
      lessonId: string,
      params: RequestParams = {},
    ) =>
      this.request<RemoveLessonFromCourseResponse, any>({
        path: `/api/lessons/${courseId}/${lessonId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerToggleLessonAsFree
     * @request PATCH:/api/lessons/course-lesson
     */
    lessonsControllerToggleLessonAsFree: (
      data: ToggleLessonAsFreeBody,
      params: RequestParams = {},
    ) =>
      this.request<ToggleLessonAsFreeResponse, any>({
        path: `/api/lessons/course-lesson`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerEvaluationQuiz
     * @request POST:/api/lessons/evaluation-quiz
     */
    lessonsControllerEvaluationQuiz: (
      query?: {
        /** @format uuid */
        courseId?: string;
        /** @format uuid */
        lessonId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EvaluationQuizResponse, any>({
        path: `/api/lessons/evaluation-quiz`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerClearQuizProgress
     * @request DELETE:/api/lessons/clear-quiz-progress
     */
    lessonsControllerClearQuizProgress: (
      query: {
        /** @format uuid */
        courseId: string;
        /** @format uuid */
        lessonId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClearQuizProgressResponse, any>({
        path: `/api/lessons/clear-quiz-progress`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetAllLessonItems
     * @request GET:/api/lessons/lesson-items
     */
    lessonsControllerGetAllLessonItems: (
      query?: {
        type?: "text_block" | "question" | "file";
        title?: string;
        state?: string;
        archived?: string;
        sort?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllLessonItemsResponse, any>({
        path: `/api/lessons/lesson-items`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetAvailableLessonItems
     * @request GET:/api/lessons/available-lesson-items
     */
    lessonsControllerGetAvailableLessonItems: (
      query?: {
        type?: "text_block" | "question" | "file";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAvailableLessonItemsResponse, any>({
        path: `/api/lessons/available-lesson-items`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetLessonItemById
     * @request GET:/api/lessons/lesson-items/{id}
     */
    lessonsControllerGetLessonItemById: (id: string, params: RequestParams = {}) =>
      this.request<GetLessonItemByIdResponse, any>({
        path: `/api/lessons/lesson-items/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerAssignItemsToLesson
     * @request POST:/api/lessons/{lessonId}/assign-items
     */
    lessonsControllerAssignItemsToLesson: (
      lessonId: string,
      data: AssignItemsToLessonBody,
      params: RequestParams = {},
    ) =>
      this.request<AssignItemsToLessonResponse, any>({
        path: `/api/lessons/${lessonId}/assign-items`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUnassignItemsFromLesson
     * @request POST:/api/lessons/{lessonId}/unassign-items
     */
    lessonsControllerUnassignItemsFromLesson: (
      lessonId: string,
      data: UnassignItemsFromLessonBody,
      params: RequestParams = {},
    ) =>
      this.request<UnassignItemsFromLessonResponse, any>({
        path: `/api/lessons/${lessonId}/unassign-items`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUpdateTextBlockItem
     * @request PATCH:/api/lessons/text-block-item
     */
    lessonsControllerUpdateTextBlockItem: (
      data: UpdateTextBlockItemBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateTextBlockItemResponse, any>({
        path: `/api/lessons/text-block-item`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUpdateQuestionItem
     * @request PATCH:/api/lessons/question-item
     */
    lessonsControllerUpdateQuestionItem: (
      data: UpdateQuestionItemBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateQuestionItemResponse, any>({
        path: `/api/lessons/question-item`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUpdateFileItem
     * @request PATCH:/api/lessons/file-item
     */
    lessonsControllerUpdateFileItem: (
      data: UpdateFileItemBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateFileItemResponse, any>({
        path: `/api/lessons/file-item`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerCreateTextBlock
     * @request POST:/api/lessons/create-text-block
     */
    lessonsControllerCreateTextBlock: (data: CreateTextBlockBody, params: RequestParams = {}) =>
      this.request<CreateTextBlockResponse, any>({
        path: `/api/lessons/create-text-block`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerCreateQuestion
     * @request POST:/api/lessons/create-question
     */
    lessonsControllerCreateQuestion: (data: CreateQuestionBody, params: RequestParams = {}) =>
      this.request<CreateQuestionResponse, any>({
        path: `/api/lessons/create-question`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerGetQuestionAnswers
     * @request GET:/api/lessons/question-options
     */
    lessonsControllerGetQuestionAnswers: (
      query?: {
        /** @format uuid */
        questionId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetQuestionAnswersResponse, any>({
        path: `/api/lessons/question-options`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerUpsertQuestionOptions
     * @request PATCH:/api/lessons/question-options
     */
    lessonsControllerUpsertQuestionOptions: (
      data: UpsertQuestionOptionsBody,
      query?: {
        /** @format uuid */
        questionId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpsertQuestionOptionsResponse, any>({
        path: `/api/lessons/question-options`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonsControllerCreateFile
     * @request POST:/api/lessons/create-file
     */
    lessonsControllerCreateFile: (data: CreateFileBody, params: RequestParams = {}) =>
      this.request<CreateFileResponse, any>({
        path: `/api/lessons/create-file`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name QuestionsControllerAnswerQuestion
     * @request POST:/api/questions/answer
     */
    questionsControllerAnswerQuestion: (data: AnswerQuestionBody, params: RequestParams = {}) =>
      this.request<AnswerQuestionResponse, any>({
        path: `/api/questions/answer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name StudentCompletedLessonItemsControllerMarkLessonItemAsCompleted
     * @request POST:/api/studentCompletedLessonItems
     */
    studentCompletedLessonItemsControllerMarkLessonItemAsCompleted: (
      query: {
        /** @format uuid */
        id: string;
        /** @format uuid */
        lessonId: string;
        courseId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarkLessonItemAsCompletedResponse, any>({
        path: `/api/studentCompletedLessonItems`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name S3ControllerUploadFile
     * @request POST:/api/files
     */
    s3ControllerUploadFile: (
      data: {
        /** @format binary */
        file?: File;
        /** Optional resource type */
        resource?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FileUploadResponse, any>({
        path: `/api/files`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name S3ControllerDeleteFile
     * @request DELETE:/api/files
     */
    s3ControllerDeleteFile: (
      query: {
        /** Key of the file to delete */
        fileKey: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/files`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name StripeControllerCreatePaymentIntent
     * @request POST:/api/stripe
     */
    stripeControllerCreatePaymentIntent: (
      query: {
        amount: number;
        currency: string;
        customerId: string;
        courseId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreatePaymentIntentResponse, any>({
        path: `/api/stripe`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name StripeWebhookControllerHandleWebhook
     * @request POST:/api/stripe/webhook
     */
    stripeWebhookControllerHandleWebhook: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stripe/webhook`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name StatisticsControllerGetUserStatistics
     * @request GET:/api/statistics
     */
    statisticsControllerGetUserStatistics: (params: RequestParams = {}) =>
      this.request<GetUserStatisticsResponse, any>({
        path: `/api/statistics`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
