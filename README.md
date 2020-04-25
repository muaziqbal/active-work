<h3 align="center">
    <br>
    <a href="https://www.activeworkflow.org"><img src="media/ActiveWorkflow-logo.svg" width="243" /></a>
</h3>

<h3 align="center">
    Turn complex requirements to workflows<br> without leaving the comfort of your technology stack 
</h3>

<br>

<p align="center">
    <a href="https://circleci.com/gh/automaticmode/active_workflow"><img alt="GitHub" src="https://img.shields.io/circleci/build/github/automaticmode/active_workflow?style=for-the-badge"></a>
    <a href="https://codecov.io/gh/automaticmode/active_workflow"><img alt="GitHub" src="https://img.shields.io/codecov/c/github/automaticmode/active_workflow?style=for-the-badge"></a>
    <a href="https://github.com/automaticmode/active_workflow/releases/latest"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/automaticmode/active_workflow?style=for-the-badge&color=287fe2"></a>
    <a href="https://github.com/automaticmode/active_workflow/blob/master/LICENSE"><img alt="GitHub release (latest by date)" src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge&color=27aace"></a>
</p>

<h4 align="center">
  <a href="#getting-started">Getting Started</a> •
  <a href="#system-overview">System Overview</a> •
  <a href="https://github.com/automaticmode/active_workflow/wiki">Documentation</a>
</h4>

## About

ActiveWorkflow works alongside your existing technology stack to give you an easy and structured way to:

- **Group business logic for periodic execution**; e.g., generate and distribute
  a weekly report.
- **Poll resources**; e.g, check if a file has become available on S3.
- **Orchestrate event-driven functionality**; e.g., trigger a customised
  email campaign in reaction to a pattern of user behaviour.

You can do all of the above by creating, scheduling, and monitoring workflows of agents, which are self-contained services (or microservices) written in any programming language you choose. ActiveWorkflow gives you a simple way to connect agents to form workflows, extensive logging, state management so that you don't have to worry about a database, and a foundation for scalability and reliability.

<p><strong>ActiveWorkflow is <u>not</u> a no-code platform</strong>, but does offer a fully featured UI so that both developers and other stakeholders can manage and monitor workflows.

<h4 align="center">Periodic Execution ◆ Polling ◆ Event-Driven Orchestration</h4>

<img src="media/workflows_screenshot.png"
     srcset="media/workflows_screenshot@2x.png 2x"
     alt="Main view">

## Getting Started


See the [Getting Started wiki page](https://github.com/automaticmode/active_workflow/wiki/Getting-Started) for full details.

If you are in a hurry and wish to take a sneak peek, you can try ActiveWorkflow in one of the following ways.


### Try with Docker

```sh
docker run -p 3000:3000 --rm automaticmode/active_workflow
```

Once it starts you can login at [http://localhost:3000](http://localhost:3000) with `admin`/`password`.

### Try on Heroku

Another quick and easy way to check out ActiveWorkflow is by deploying it on
[Heroku](https://www.heroku.com/).

All you need to do is click the button bellow and fill in the environment variables for your seed user (admin):
`SEED_USERNAME`, `SEED_PASSWORD` (must be at least 8 characters long) and `SEED_EMAIL`.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/automaticmode/active_workflow&env[SINGLE_DYNO]=1)

*Note: the button above deploys ActiveWorkflow on a single dyno so that it can use the free Heroku plan. This configuration is not recommended for production, please see [Getting Started](https://github.com/automaticmode/active_workflow/wiki/Getting-Started#Running-On-Heroku) for more details.*

## System Overview

You can use ActiveWorkflow via its web interface or its [REST API](https://github.com/automaticmode/active_workflow/wiki/REST-API) as illustrated in the diagram below. In this example a1–a6 are six agents and w1–w3 are three workflows these agents are part of.

<img src="media/AW_usage_diagram.svg" alt="ActiveWorkflow system overview diagram" />

## Documentation

You can find the full documentation at the [ActiveWorkflow Wiki](https://github.com/automaticmode/active_workflow/wiki).

## Acknowledgements

ActiveWorkflow started as a fork of [Huginn](https://github.com/huginn/huginn) with
the goal of targeting solely business use, API and polyglot functionality, and a smaller codebase. ActiveWorkflow is incompatible with Huginn.


## License

ActiveWorkflow is released under the [MIT License](LICENSE).
