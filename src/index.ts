/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import "module-alias/register";
import { ClusterServer } from "@/vendor/ikoabo/controllers/cluster.controller";
import { ServiceSettings } from "@/settings/service.settings";
import AccountsRouter from "@/routers/v1/accounts.router";

/* Initialize cluster server */
const clusterServer = ClusterServer.setup(ServiceSettings);

/* Run cluster with base routes */
clusterServer.run({
  "/accounts": AccountsRouter
});
