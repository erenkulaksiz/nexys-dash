import { useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdClose, MdAdd } from "react-icons/md";

import { reducer } from "./reducer";
import Button from "@/components/Button";
import Input from "@/components/Input";
import View from "@/components/View";
import { AddProjectActionType } from "./AddProject.types";
import { formatString, Log } from "@/utils";
import { LIMITS } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import isValidURL from "@/utils/isValidUrl";
import { createProject } from "@/utils/service/project/create";
import { nexys } from "@/utils/nexys";
import type { ProjectTypes } from "@/types";

export default function AddProject() {
  const router = useRouter();
  const validatedUser = useAuthStore((state) => state.validatedUser);

  const [loading, setLoading] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    domain: "",
    errors: {
      name: "",
      domain: "",
      project: "",
    },
  });

  async function onAddProject({ name, domain }: ProjectTypes) {
    if (loading) return;
    setLoading(true);

    const res = await createProject({
      name,
      domain,
      uid: validatedUser?.uid,
    });

    if (res.success) {
      router.push({ pathname: "/", query: { newProject: true } }, "/");
      return;
    }

    if (res.error == "project/max-projects") {
      dispatch({
        type: AddProjectActionType.SET_PROJECT_ERROR,
        payload: `You can create maximum of ${LIMITS.MAX.PROJECT_LENGTH} projects.`,
      });
    } else if (res.error == "project/domain-taken") {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: `This domain has been already taken.`,
      });
    } else if (res.error == "project/name-taken") {
      dispatch({
        type: AddProjectActionType.SET_NAME_ERROR,
        payload: `This project name has been already taken.`,
      });
    } else {
      dispatch({
        type: AddProjectActionType.SET_PROJECT_ERROR,
        payload: `Something went wrong. Please try again later.`,
      });
    }

    setLoading(false);
    Log.error(res);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      state.domain.trim().length === 0 &&
      state.domain.trim().length < LIMITS.MIN.PROJECT_NAME_CHARACTER_LENGTH
    ) {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: `Project domain must be minimum ${LIMITS.MIN.PROJECT_NAME_CHARACTER_LENGTH} characters.`,
      });
      return;
    }
    if (
      !isValidURL(`https://${state.domain}`) ||
      state.domain.split(".").length != 2
    ) {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: "Project domain must be valid.",
      });
      return;
    }
    if (
      state.name.trim().length === 0 &&
      state.name.trim().length < LIMITS.MIN.PROJECT_NAME_CHARACTER_LENGTH
    ) {
      dispatch({
        type: AddProjectActionType.SET_NAME_ERROR,
        payload: "Please enter a valid project name.",
      });
      return;
    }
    if (state.domain.split(".").length > 2) {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: "Subdomains are not allowed.",
      });
      return;
    }
    if (state.domain.includes("https://") || state.domain.includes("http://")) {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: "Please remove https:// or http:// from the domain.",
      });
      return;
    }
    if (state.domain.includes(" ")) {
      dispatch({
        type: AddProjectActionType.SET_DOMAIN_ERROR,
        payload: "Domain must not contain spaces.",
      });
      return;
    }
    if (state.name.includes(" ")) {
      dispatch({
        type: AddProjectActionType.SET_NAME_ERROR,
        payload: "App name must not contain spaces.",
      });
      return;
    }

    nexys.log(
      {
        name: state.name,
        domain: state.domain,
      },
      { action: "CREATE_PROJECT" }
    );

    onAddProject({ name: state.name, domain: state.domain });
  }

  return (
    <div className="order-last sm:order-first flex flex-col justify-between dark:bg-dark bg-white pb-4 rounded-lg border-[1px] border-neutral-200 dark:border-dark-border">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h1 className="dark:text-dark-text text-xl font-semibold p-4 border-b-[1px] border-neutral-200 dark:border-dark-border">
          New Project
        </h1>
        <div className="flex flex-col gap-2 px-4">
          <label htmlFor="projectName" className="dark:text-dark-text">
            Project Name
          </label>
          <Input
            type="text"
            value={state.name}
            id="projectName"
            height="h-10"
            onChange={(e) =>
              dispatch({
                type: AddProjectActionType.SET_NAME,
                payload: formatString(e.target.value).toLocaleLowerCase(),
              })
            }
            placeholder="myapp"
            maxLength={LIMITS.MAX.PROJECT_NAME_CHARACTER_LENGTH}
          />
          <span className="text-neutral-500 dark:text-dark-accent text-sm">
            This name acts as app name for your project. It must be unique and
            can only contain letters.
          </span>
          <View.If visible={!!state.errors.name}>
            <label className="text-red-600 font-semibold text-xs">
              {state.errors.name}
            </label>
          </View.If>
          <label htmlFor="domain" className="dark:text-dark-text">
            Domain
          </label>
          <Input
            type="text"
            value={state.domain}
            height="h-10"
            id="domain"
            className="pl-[56px] pb-[1px]"
            icon={<span className="text-neutral-500">https://</span>}
            onChange={(e) =>
              dispatch({
                type: AddProjectActionType.SET_DOMAIN,
                payload: e.target.value.replace(" ", ""),
              })
            }
            placeholder="example.com"
            maxLength={LIMITS.MAX.PROJECT_DOMAIN_CHARACTER_LENGTH}
          />
          <span className="text-neutral-500 dark:text-dark-accent text-sm">
            Domain is used to identify your project. It must be unique and can
            only contain letters.
          </span>
          <View.If visible={!!state.errors.domain}>
            <label className="text-red-600 font-semibold text-xs">
              {state.errors.domain}
            </label>
          </View.If>
        </div>
        <View.If visible={!!state.errors.project?.length}>
          <label className="text-red-600 font-semibold text-xs px-4">
            {state.errors.project}
          </label>
        </View.If>
        <div className="flex flex-row justify-end gap-2 px-4">
          <Link href="/">
            <Button type="button" className="px-2" loading={loading}>
              <MdClose />
              <span className="text-xs ml-1">cancel</span>
            </Button>
          </Link>
          <View.If visible={!!state.name.trim().length}>
            <Button type="submit" className="px-2" loading={loading}>
              <MdAdd />
              <span className="text-xs ml-1">add</span>
            </Button>
          </View.If>
        </div>
      </form>
    </div>
  );
}
