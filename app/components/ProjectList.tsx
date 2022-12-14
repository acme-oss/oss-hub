import { FunctionComponent } from "react";
import { Project, GitHubData } from "../types";
import ProjectListWrapper from "./local-search/ProjectListWrapper";
import useSearch from "./local-search/useSearch";
import ProjectCard from "./ProjectCard";
import {
  OPTION_MOST_ACTIVE,
  OPTION_MOST_OPEN_ISSUES,
  OPTION_MOST_POPULARITY,
} from "~/utils/constants";

type Props = {
  allProjects: Project[];
  githubDataSet: { [key: string]: GitHubData };
  helpfulnessDataSet: { [slug: string]: number };
};

const ProjectList: FunctionComponent<Props> = ({
  allProjects,
  githubDataSet,
}) => {
  const { filteredProjectIds, allActiveTags, sortOption } = useSearch();

  if (filteredProjectIds.length === 0) {
    return (
      <div className="text-center px-4 mt-24 mb-32 flex-grow">
        <h3 className="text-black-500 text-2xl font-semibold mb-4">
          No results
        </h3>
        <p className="text-black-300">
          No projects matched your search. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const filteredProjects = allProjects.filter((project) =>
    filteredProjectIds.includes(project.slug)
  );

  if (sortOption.value === OPTION_MOST_OPEN_ISSUES) {
    // Sort projects by most open issues (highest count of opened issues)
    filteredProjects.sort((projectA, projectB) => {
      return (
        githubDataSet[projectB.slug].totalOpenIssues -
        githubDataSet[projectA.slug].totalOpenIssues
      );
    });
  } else if (sortOption.value === OPTION_MOST_ACTIVE) {
    // Sort projects by most active (highest count of recently-closed PRs)
    filteredProjects.sort((projectA, projectB) => {
      return (
        githubDataSet[projectB.slug].prsMerged.count -
        githubDataSet[projectA.slug].prsMerged.count
      );
    });
  } else if (sortOption.value === OPTION_MOST_POPULARITY) {
    // Sort projects by most popularity (highest number of contributors)
    filteredProjects.sort((projectA, projectB) => {
      return (
        githubDataSet[projectB.slug].totalContributors -
        githubDataSet[projectA.slug].totalContributors
      );
    });
  }

  return (
    <ProjectListWrapper>
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          githubData={githubDataSet[project.slug]}
          activeTags={allActiveTags}
        />
      ))}
    </ProjectListWrapper>
  );
};

export default ProjectList;
