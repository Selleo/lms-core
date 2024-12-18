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
  appliedFilters?: object;
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
  role?: "admin" | "student" | "teacher";
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
  role?: "admin" | "student" | "teacher";
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
  role: "admin" | "student" | "teacher";
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
  appliedFilters?: object;
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
    thumbnailUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseChapterCount: number;
    completedChapterCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    isPublished?: boolean;
    createdAt?: string;
    hasFreeChapters?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
  appliedFilters?: object;
}

export interface GetStudentCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseChapterCount: number;
    completedChapterCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    isPublished?: boolean;
    createdAt?: string;
    hasFreeChapters?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
  appliedFilters?: object;
}

export interface GetAvailableCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseChapterCount: number;
    completedChapterCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    isPublished?: boolean;
    createdAt?: string;
    hasFreeChapters?: boolean;
  }[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
  appliedFilters?: object;
}

export interface GetTeacherCoursesResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl: string | null;
    description: string;
    /** @format uuid */
    authorId?: string;
    author: string;
    authorEmail?: string;
    category: string;
    courseChapterCount: number;
    completedChapterCount: number;
    enrolled?: boolean;
    enrolledParticipantCount: number;
    priceInCents: number;
    currency: string;
    isPublished?: boolean;
    createdAt?: string;
    hasFreeChapters?: boolean;
  }[];
}

export interface GetCourseResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl?: string;
    description: string;
    category: string;
    /** @format uuid */
    categoryId?: string;
    /** @format uuid */
    authorId?: string;
    author?: string;
    authorEmail?: string;
    courseChapterCount: number;
    completedChapterCount?: number;
    enrolled?: boolean;
    isPublished: boolean | null;
    isScorm?: boolean;
    chapters: {
      /** @format uuid */
      id: string;
      title: string;
      lessonCount: number;
      completedLessonCount?: number;
      chapterProgress?: "completed" | "in_progress" | "not_started";
      isFreemium?: boolean;
      enrolled?: boolean;
      isPublished?: boolean;
      isSubmitted?: boolean;
      createdAt?: string;
      quizScore?: number;
    }[];
    priceInCents: number;
    currency: string;
    archived?: boolean;
    hasFreeChapter?: boolean;
  };
}

export interface GetCourseByIdResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl?: string;
    description: string;
    category: string;
    /** @format uuid */
    categoryId?: string;
    /** @format uuid */
    authorId?: string;
    author?: string;
    authorEmail?: string;
    courseChapterCount: number;
    completedChapterCount?: number;
    enrolled?: boolean;
    isPublished: boolean | null;
    isScorm?: boolean;
    chapters: {
      /** @format uuid */
      id: string;
      title: string;
      lessonCount: number;
      completedLessonCount?: number;
      chapterProgress?: "completed" | "in_progress" | "not_started";
      isFreemium?: boolean;
      enrolled?: boolean;
      isPublished?: boolean;
      isSubmitted?: boolean;
      createdAt?: string;
      quizScore?: number;
    }[];
    priceInCents: number;
    currency: string;
    archived?: boolean;
    hasFreeChapter?: boolean;
  };
}

export interface GetBetaCourseByIdResponse {
  data: {
    /** @format uuid */
    id: string;
    title: string;
    thumbnailUrl?: string;
    description: string;
    category: string;
    /** @format uuid */
    categoryId?: string;
    /** @format uuid */
    authorId?: string;
    author?: string;
    authorEmail?: string;
    courseChapterCount: number;
    completedChapterCount?: number;
    enrolled?: boolean;
    isPublished: boolean | null;
    isScorm?: boolean;
    chapters: {
      /** @format uuid */
      id: string;
      title: string;
      lessonCount: number;
      completedLessonCount?: number;
      chapterProgress?: "completed" | "in_progress" | "not_started";
      isFreemium?: boolean;
      enrolled?: boolean;
      isPublished?: boolean;
      isSubmitted?: boolean;
      createdAt?: string;
      quizScore?: number;
    }[];
    priceInCents: number;
    currency: string;
    archived?: boolean;
    hasFreeChapter?: boolean;
  };
}

export type CreateCourseBody = {
  title: string;
  description: string;
  isPublished?: boolean;
  thumbnailS3Key?: string;
  priceInCents?: number;
  currency?: string;
  /** @format uuid */
  categoryId: string;
  isScorm?: boolean;
} & {
  chapters?: string[];
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
  thumbnailS3Key?: string;
  isPublished?: boolean;
  priceInCents?: number;
  currency?: string;
  /** @format uuid */
  categoryId?: string;
  chapters?: string[];
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

export interface FileUploadResponse {
  fileKey: string;
  fileUrl: string;
}

export type BetaCreateLessonBody = {
  updatedAt?: string;
  title: string;
  type: string;
  description: string;
  fileS3Key?: string;
  fileType?: string;
  questions?: {
    /** @format uuid */
    id?: string;
    type:
      | "single_choice"
      | "multiple_choice"
      | "true_or_false"
      | "photo_question"
      | "fill_in_the_blanks"
      | "brief_response"
      | "detailed_response";
    description?: string;
    title: string;
    photoQuestionType?: "single_choice" | "multiple_choice";
    photoS3Key?: string;
    options?: {
      /** @format uuid */
      id?: string;
      optionText: string;
      isCorrect: boolean;
      position: number;
    }[];
  }[];
} & {
  /** @format uuid */
  chapterId: string;
  displayOrder?: number;
};

export interface BetaCreateLessonResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export type BetaCreateQuizLessonBody = {
  title: string;
  type: string;
  description?: string;
  fileS3Key?: string;
  fileType?: string;
  questions?: {
    /** @format uuid */
    id?: string;
    type:
      | "single_choice"
      | "multiple_choice"
      | "true_or_false"
      | "photo_question"
      | "fill_in_the_blanks"
      | "brief_response"
      | "detailed_response";
    description?: string;
    title: string;
    photoQuestionType?: "single_choice" | "multiple_choice";
    photoS3Key?: string;
    options?: {
      /** @format uuid */
      id?: string;
      optionText: string;
      isCorrect: boolean;
      position: number;
    }[];
  }[];
} & {
  /** @format uuid */
  chapterId: string;
  displayOrder?: number;
};

export interface BetaCreateQuizLessonResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export type BetaUpdateQuizLessonBody = {
  title?: string;
  type?: string;
  description?: string;
  fileS3Key?: string;
  fileType?: string;
  questions?: {
    /** @format uuid */
    id?: string;
    type:
      | "single_choice"
      | "multiple_choice"
      | "true_or_false"
      | "photo_question"
      | "fill_in_the_blanks"
      | "brief_response"
      | "detailed_response";
    description?: string;
    title: string;
    photoQuestionType?: "single_choice" | "multiple_choice";
    photoS3Key?: string;
    options?: {
      /** @format uuid */
      id?: string;
      optionText: string;
      isCorrect: boolean;
      position: number;
    }[];
  }[];
} & {
  /** @format uuid */
  chapterId?: string;
  displayOrder?: number;
};

export interface BetaUpdateQuizLessonResponse {
  data: {
    message: string;
  };
}

export type BetaUpdateLessonBody = {
  updatedAt?: string;
  title?: string;
  type?: string;
  description?: string;
  fileS3Key?: string;
  fileType?: string;
  questions?: {
    /** @format uuid */
    id?: string;
    type:
      | "single_choice"
      | "multiple_choice"
      | "true_or_false"
      | "photo_question"
      | "fill_in_the_blanks"
      | "brief_response"
      | "detailed_response";
    description?: string;
    title: string;
    photoQuestionType?: "single_choice" | "multiple_choice";
    photoS3Key?: string;
    options?: {
      /** @format uuid */
      id?: string;
      optionText: string;
      isCorrect: boolean;
      position: number;
    }[];
  }[];
} & {
  /** @format uuid */
  chapterId?: string;
  displayOrder?: number;
};

export interface BetaUpdateLessonResponse {
  data: {
    message: string;
  };
}

export interface RemoveLessonResponse {
  data: {
    message: string;
  };
}

export interface UpdateLessonDisplayOrderBody {
  /** @format uuid */
  lessonId: string;
  displayOrder: number;
}

export interface UpdateLessonDisplayOrderResponse {
  data: {
    message: string;
  };
}

export type BetaCreateChapterBody = {
  title: string;
  chapterProgress?: "completed" | "in_progress" | "not_started";
  isFreemium?: boolean;
  enrolled?: boolean;
  isPublished?: boolean;
  isSubmitted?: boolean;
  createdAt?: string;
  quizScore?: number;
} & {
  /** @format uuid */
  courseId: string;
};

export interface BetaCreateChapterResponse {
  data: {
    /** @format uuid */
    id: string;
    message: string;
  };
}

export interface UpdateChapterDisplayOrderBody {
  /** @format uuid */
  chapterId: string;
  displayOrder: number;
}

export interface UpdateChapterDisplayOrderResponse {
  data: {
    message: string;
  };
}

export interface RemoveChapterResponse {
  data: {
    message: string;
  };
}

export interface UpdateFreemiumStatusBody {
  isFreemium: boolean;
}

export interface UpdateFreemiumStatusResponse {
  data: {
    message: string;
  };
}

export interface MarkLessonAsCompletedResponse {
  data: {
    message: string;
  };
}

export interface CreatePaymentIntentResponse {
  data: {
    clientSecret: string;
  };
}

export interface UploadScormPackageResponse {
  data: {
    message: string;
    metadata: {
      /** @format uuid */
      id: string;
      createdAt: string;
      updatedAt: string;
      /** @format uuid */
      courseId: string;
      /** @format uuid */
      fileId: string;
      version: string;
      entryPoint: string;
      s3Key: string;
    };
  };
}

export interface GetScormMetadataResponse {
  data: {
    /** @format uuid */
    id: string;
    createdAt: string;
    updatedAt: string;
    /** @format uuid */
    courseId: string;
    /** @format uuid */
    fileId: string;
    version: string;
    entryPoint: string;
    s3Key: string;
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
        ...(type ? { "Content-Type": type } : {}),
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
     * @name CategoryControllerGetAllCategories
     * @request GET:/api/category
     */
    categoryControllerGetAllCategories: (
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
        path: `/api/category`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoryControllerCreateCategory
     * @request POST:/api/category
     */
    categoryControllerCreateCategory: (data: CreateCategoryBody, params: RequestParams = {}) =>
      this.request<CreateCategoryResponse, any>({
        path: `/api/category`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoryControllerGetCategoryById
     * @request GET:/api/category/{id}
     */
    categoryControllerGetCategoryById: (id: string, params: RequestParams = {}) =>
      this.request<GetCategoryByIdResponse, any>({
        path: `/api/category/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoryControllerUpdateCategory
     * @request PATCH:/api/category/{id}
     */
    categoryControllerUpdateCategory: (
      id: string,
      data: UpdateCategoryBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCategoryResponse, any>({
        path: `/api/category/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetAllCourses
     * @request GET:/api/course
     */
    courseControllerGetAllCourses: (
      query?: {
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "chapterCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-chapterCount"
          | "-enrolledParticipantsCount";
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
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllCoursesResponse, any>({
        path: `/api/course`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerCreateCourse
     * @request POST:/api/course
     */
    courseControllerCreateCourse: (data: CreateCourseBody, params: RequestParams = {}) =>
      this.request<CreateCourseResponse, any>({
        path: `/api/course`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetStudentCourses
     * @request GET:/api/course/get-student-courses
     */
    courseControllerGetStudentCourses: (
      query?: {
        title?: string;
        category?: string;
        author?: string;
        "creationDateRange[0]"?: string;
        "creationDateRange[1]"?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "chapterCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-chapterCount"
          | "-enrolledParticipantsCount";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetStudentCoursesResponse, any>({
        path: `/api/course/get-student-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetAvailableCourses
     * @request GET:/api/course/available-courses
     */
    courseControllerGetAvailableCourses: (
      query?: {
        title?: string;
        category?: string;
        author?: string;
        "creationDateRange[0]"?: string;
        "creationDateRange[1]"?: string;
        /** @min 1 */
        page?: number;
        perPage?: number;
        sort?:
          | "title"
          | "category"
          | "creationDate"
          | "author"
          | "chapterCount"
          | "enrolledParticipantsCount"
          | "-title"
          | "-category"
          | "-creationDate"
          | "-author"
          | "-chapterCount"
          | "-enrolledParticipantsCount";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAvailableCoursesResponse, any>({
        path: `/api/course/available-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetTeacherCourses
     * @request GET:/api/course/teacher-courses
     */
    courseControllerGetTeacherCourses: (
      query: {
        /** @format uuid */
        authorId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTeacherCoursesResponse, any>({
        path: `/api/course/teacher-courses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetCourse
     * @request GET:/api/course/course
     */
    courseControllerGetCourse: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseResponse, any>({
        path: `/api/course/course`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetCourseById
     * @request GET:/api/course/course-by-id
     */
    courseControllerGetCourseById: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseByIdResponse, any>({
        path: `/api/course/course-by-id`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerGetBetaCourseById
     * @request GET:/api/course/beta-course-by-id
     */
    courseControllerGetBetaCourseById: (
      query: {
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetBetaCourseByIdResponse, any>({
        path: `/api/course/beta-course-by-id`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerUpdateCourse
     * @request PATCH:/api/course/{id}
     */
    courseControllerUpdateCourse: (
      id: string,
      data: UpdateCourseBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCourseResponse, any>({
        path: `/api/course/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerEnrollCourse
     * @request POST:/api/course/enroll-course
     */
    courseControllerEnrollCourse: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EnrollCourseResponse, any>({
        path: `/api/course/enroll-course`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CourseControllerUnenrollCourse
     * @request DELETE:/api/course/unenroll-course
     */
    courseControllerUnenrollCourse: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UnenrollCourseResponse, any>({
        path: `/api/course/unenroll-course`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name FileControllerUploadFile
     * @request POST:/api/file
     */
    fileControllerUploadFile: (
      data: {
        /** @format binary */
        file?: File;
        /** Optional resource type */
        resource?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FileUploadResponse, any>({
        path: `/api/file`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name FileControllerDeleteFile
     * @request DELETE:/api/file
     */
    fileControllerDeleteFile: (
      query: {
        /** Key of the file to delete */
        fileKey: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/file`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonControllerBetaCreateLesson
     * @request POST:/api/lesson/beta-create-lesson
     */
    lessonControllerBetaCreateLesson: (data: BetaCreateLessonBody, params: RequestParams = {}) =>
      this.request<BetaCreateLessonResponse, any>({
        path: `/api/lesson/beta-create-lesson`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonControllerBetaCreateQuizLesson
     * @request POST:/api/lesson/beta-create-lesson/quiz
     */
    lessonControllerBetaCreateQuizLesson: (
      data: BetaCreateQuizLessonBody,
      params: RequestParams = {},
    ) =>
      this.request<BetaCreateQuizLessonResponse, any>({
        path: `/api/lesson/beta-create-lesson/quiz`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonControllerBetaUpdateQuizLesson
     * @request PATCH:/api/lesson/beta-update-lesson/quiz
     */
    lessonControllerBetaUpdateQuizLesson: (
      data: BetaUpdateQuizLessonBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BetaUpdateQuizLessonResponse, any>({
        path: `/api/lesson/beta-update-lesson/quiz`,
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
     * @name LessonControllerBetaUpdateLesson
     * @request PATCH:/api/lesson/beta-update-lesson
     */
    lessonControllerBetaUpdateLesson: (
      data: BetaUpdateLessonBody,
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BetaUpdateLessonResponse, any>({
        path: `/api/lesson/beta-update-lesson`,
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
     * @name LessonControllerRemoveLesson
     * @request DELETE:/api/lesson
     */
    lessonControllerRemoveLesson: (
      query: {
        /** @format uuid */
        lessonId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RemoveLessonResponse, any>({
        path: `/api/lesson`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name LessonControllerUpdateLessonDisplayOrder
     * @request PATCH:/api/lesson/lesson-display-order
     */
    lessonControllerUpdateLessonDisplayOrder: (
      data: UpdateLessonDisplayOrderBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateLessonDisplayOrderResponse, any>({
        path: `/api/lesson/lesson-display-order`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ChapterControllerBetaCreateChapter
     * @request POST:/api/chapter/beta-create-chapter
     */
    chapterControllerBetaCreateChapter: (data: BetaCreateChapterBody, params: RequestParams = {}) =>
      this.request<BetaCreateChapterResponse, any>({
        path: `/api/chapter/beta-create-chapter`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ChapterControllerUpdateChapterDisplayOrder
     * @request PATCH:/api/chapter/chapter-display-order
     */
    chapterControllerUpdateChapterDisplayOrder: (
      data: UpdateChapterDisplayOrderBody,
      params: RequestParams = {},
    ) =>
      this.request<UpdateChapterDisplayOrderResponse, any>({
        path: `/api/chapter/chapter-display-order`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ChapterControllerRemoveChapter
     * @request DELETE:/api/chapter
     */
    chapterControllerRemoveChapter: (
      query: {
        /** @format uuid */
        chapterId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RemoveChapterResponse, any>({
        path: `/api/chapter`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ChapterControllerUpdateFreemiumStatus
     * @request PATCH:/api/chapter/freemium-status
     */
    chapterControllerUpdateFreemiumStatus: (
      data: UpdateFreemiumStatusBody,
      query?: {
        /** @format uuid */
        chapterId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateFreemiumStatusResponse, any>({
        path: `/api/chapter/freemium-status`,
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
     * @name StudentLessonProgressControllerMarkLessonAsCompleted
     * @request POST:/api/studentLessonProgress
     */
    studentLessonProgressControllerMarkLessonAsCompleted: (
      query: {
        /** @format uuid */
        lessonId: string;
        /** @format uuid */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarkLessonAsCompletedResponse, any>({
        path: `/api/studentLessonProgress`,
        method: "POST",
        query: query,
        format: "json",
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
     * @name ScormControllerUploadScormPackage
     * @request POST:/api/scorm/upload
     */
    scormControllerUploadScormPackage: (
      query: {
        courseId: string;
      },
      data: {
        /** @format binary */
        file?: File;
        /** Optional resource type */
        resource?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadScormPackageResponse, any>({
        path: `/api/scorm/upload`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ScormControllerServeScormContent
     * @request GET:/api/scorm/{courseId}/content
     */
    scormControllerServeScormContent: (
      courseId: string,
      query: {
        path: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/scorm/${courseId}/content`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name ScormControllerGetScormMetadata
     * @request GET:/api/scorm/{courseId}/metadata
     */
    scormControllerGetScormMetadata: (courseId: string, params: RequestParams = {}) =>
      this.request<GetScormMetadataResponse, any>({
        path: `/api/scorm/${courseId}/metadata`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
