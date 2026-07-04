const payloadSamples = {
  requestAction: {
    title: "Request Action",
    endpoint: "POST /api/governance/access-check",
    sample: {
      messageId: "msg-001",
      eventType: "RequestAction",
      source: "PICKS_UI",
      target: "RBAC_POLICY_SERVICE",
      timestamp: "2026-07-03T14:05:00Z",
      payload: {
        userIdentity: {
          userId: "u-1042",
          displayName: "Sample User",
          role: "LogisticsCoordinator"
        },
        requestedAction: "CREATE_MES_RECORD",
        targetSystem: "Potential MES Candidate"
      }
    }
  },
  authorizationGranted: {
    title: "Authorization Granted",
    endpoint: "200 /api/governance/access-check",
    sample: {
      messageId: "msg-002",
      correlationId: "msg-001",
      eventType: "AuthorizationDecision",
      source: "RBAC_POLICY_SERVICE",
      target: "PICKS_UI",
      timestamp: "2026-07-03T14:05:01Z",
      payload: {
        roleMatch: true,
        allowedPermission: "mes.record.write",
        sessionDecision: "ALLOW",
        policyVersion: "rbac-policy-2026.07"
      }
    }
  },
  submitRequest: {
    title: "Submit Request",
    endpoint: "POST /api/integration/requests",
    sample: {
      messageId: "msg-003",
      eventType: "SubmitApprovedRequest",
      source: "PICKS_UI",
      target: "INTEGRATION_LAYER",
      timestamp: "2026-07-03T14:05:03Z",
      payload: {
        approvedRequestId: "req-78211",
        partNumber: "PN-8842-A",
        workflowContext: {
          bomId: "BOM-24018",
          buildIdentifier: "BUILD-ALPHA-07",
          requestedOperation: "create-or-update"
        }
      }
    }
  },
  requestErpData: {
    title: "Request ERP Data",
    endpoint: "GET /api/erp/procurement-inventory",
    sample: {
      messageId: "msg-004",
      eventType: "RequestErpData",
      source: "INTEGRATION_LAYER",
      target: "ORACLE_ERP",
      timestamp: "2026-07-03T14:05:05Z",
      payload: {
        procurementLookup: {
          purchaseOrderId: "PO-590133",
          vendorId: "VEND-2204"
        },
        inventoryLookup: {
          partNumber: "PN-8842-A",
          warehouseCode: "LAB-STORES"
        },
        assetIdentifier: "ASSET-77420"
      }
    }
  },
  erpData: {
    title: "Procurement and Inventory Data",
    endpoint: "200 /api/erp/procurement-inventory",
    sample: {
      messageId: "msg-005",
      correlationId: "msg-004",
      eventType: "ErpDataResponse",
      source: "ORACLE_ERP",
      target: "INTEGRATION_LAYER",
      timestamp: "2026-07-03T14:05:06Z",
      payload: {
        purchaseOrder: "PO-590133",
        vendor: {
          vendorId: "VEND-2204",
          name: "Sample Components LLC"
        },
        partNumber: "PN-8842-A",
        quantity: 24,
        inventoryStatus: "AVAILABLE"
      }
    }
  },
  requestFinancialData: {
    title: "Request Financial Data",
    endpoint: "GET /api/finance/project-context",
    sample: {
      messageId: "msg-006",
      eventType: "RequestFinancialData",
      source: "INTEGRATION_LAYER",
      target: "WORKDAY",
      timestamp: "2026-07-03T14:05:08Z",
      payload: {
        projectAccount: "PRJ-6104",
        costObject: "CO-44391",
        fundingReference: "FUND-2026-019"
      }
    }
  },
  financialData: {
    title: "Financial Data",
    endpoint: "200 /api/finance/project-context",
    sample: {
      messageId: "msg-007",
      correlationId: "msg-006",
      eventType: "FinancialDataResponse",
      source: "WORKDAY",
      target: "INTEGRATION_LAYER",
      timestamp: "2026-07-03T14:05:09Z",
      payload: {
        fundingStatus: "ACTIVE",
        financialReference: "FIN-REF-88312",
        projectCostData: {
          projectAccount: "PRJ-6104",
          availableBudget: 125000,
          currency: "USD"
        }
      }
    }
  },
  requestLegacyData: {
    title: "Request Legacy Data",
    endpoint: "GET /api/legacy/lab-records",
    sample: {
      messageId: "msg-008",
      eventType: "RequestLegacyData",
      source: "INTEGRATION_LAYER",
      target: "PEDYN_LEGACY",
      timestamp: "2026-07-03T14:05:11Z",
      payload: {
        partNumber: "PN-8842-A",
        buildIdentifier: "BUILD-ALPHA-07",
        labRecordLookup: {
          includeBuildHistory: true,
          includeOpenIssues: true
        }
      }
    }
  },
  legacyData: {
    title: "Existing Lab Data",
    endpoint: "200 /api/legacy/lab-records",
    sample: {
      messageId: "msg-009",
      correlationId: "msg-008",
      eventType: "LegacyLabDataResponse",
      source: "PEDYN_LEGACY",
      target: "INTEGRATION_LAYER",
      timestamp: "2026-07-03T14:05:12Z",
      payload: {
        legacyPartRecord: "PEDYN-PART-11902",
        buildHistory: [
          {
            buildIdentifier: "BUILD-ALPHA-07",
            completedStep: "inspection",
            completedAt: "2026-06-28T19:20:00Z"
          }
        ],
        labStatus: "READY_FOR_UPDATE"
      }
    }
  },
  createUpdateRecord: {
    title: "Create or Update Record",
    endpoint: "PUT /api/mes/records/{recordId}",
    sample: {
      messageId: "msg-010",
      eventType: "CreateOrUpdateMesRecord",
      source: "INTEGRATION_LAYER",
      target: "MES_CANDIDATE",
      timestamp: "2026-07-03T14:05:14Z",
      payload: {
        mappedItemRecord: {
          partNumber: "PN-8842-A",
          sourcePurchaseOrder: "PO-590133",
          sourceLegacyRecord: "PEDYN-PART-11902"
        },
        inventoryUpdate: {
          quantityAvailable: 24,
          inventoryStatus: "AVAILABLE"
        },
        operationStatus: "READY_FOR_BUILD",
        traceLink: "trace://picks/req-78211"
      }
    }
  },
  statusConfirmation: {
    title: "Status Confirmation",
    endpoint: "200 /api/mes/records/{recordId}",
    sample: {
      messageId: "msg-011",
      correlationId: "msg-010",
      eventType: "MesStatusConfirmation",
      source: "MES_CANDIDATE",
      target: "INTEGRATION_LAYER",
      timestamp: "2026-07-03T14:05:16Z",
      payload: {
        updateResult: "UPDATED",
        mesRecordId: "MES-REC-55029",
        synchronizationStatus: "SUCCESS",
        warnings: []
      }
    }
  },
  logActivity: {
    title: "Log Activity",
    endpoint: "POST /api/governance/audit-events",
    sample: {
      messageId: "msg-012",
      eventType: "IntegrationActivityLogged",
      source: "INTEGRATION_LAYER",
      target: "RBAC_AUDIT_SERVICE",
      timestamp: "2026-07-03T14:05:18Z",
      payload: {
        transactionId: "txn-20260703-00042",
        user: "u-1042",
        systemsTouched: ["RBAC_POLICY_SERVICE", "ORACLE_ERP", "WORKDAY", "PEDYN_LEGACY", "MES_CANDIDATE"],
        decisionOutcome: "ALLOW_AND_SYNC_SUCCESS",
        auditTags: ["SYS-6.5", "5.6.2.1"]
      }
    }
  }
};

const payloadErrors = {
  requestAction: {
    title: "Request Action Error",
    status: "403 Forbidden",
    sample: {
      errorId: "err-001",
      correlationId: "msg-001",
      status: 403,
      code: "ACCESS_DENIED",
      message: "User role is not authorized to create or update MES records.",
      source: "RBAC_POLICY_SERVICE",
      target: "PICKS_UI",
      retryable: false,
      details: {
        userId: "u-1042",
        requestedAction: "CREATE_MES_RECORD",
        requiredPermission: "mes.record.write"
      }
    }
  },
  authorizationGranted: {
    title: "Authorization Decision Error",
    status: "401 Unauthorized",
    sample: {
      errorId: "err-002",
      correlationId: "msg-001",
      status: 401,
      code: "SESSION_EXPIRED",
      message: "The user session expired before the authorization decision could be returned.",
      source: "RBAC_POLICY_SERVICE",
      target: "PICKS_UI",
      retryable: true,
      details: {
        sessionState: "EXPIRED",
        recommendedAction: "Re-authenticate and resubmit the request."
      }
    }
  },
  submitRequest: {
    title: "Submit Request Error",
    status: "422 Unprocessable Entity",
    sample: {
      errorId: "err-003",
      correlationId: "msg-003",
      status: 422,
      code: "INVALID_WORKFLOW_CONTEXT",
      message: "The request is missing a valid BOM or build context.",
      source: "INTEGRATION_LAYER",
      target: "PICKS_UI",
      retryable: false,
      details: {
        missingFields: ["workflowContext.bomId"],
        partNumber: "PN-8842-A"
      }
    }
  },
  requestErpData: {
    title: "ERP Request Error",
    status: "503 Service Unavailable",
    sample: {
      errorId: "err-004",
      correlationId: "msg-004",
      status: 503,
      code: "ERP_CONNECTOR_UNAVAILABLE",
      message: "Oracle ERP connector did not respond within the configured timeout.",
      source: "INTEGRATION_LAYER",
      target: "ORACLE_ERP",
      retryable: true,
      details: {
        timeoutMs: 8000,
        connector: "oracle-procurement-inventory",
        fallbackMode: "queue-and-retry"
      }
    }
  },
  erpData: {
    title: "ERP Data Error",
    status: "404 Not Found",
    sample: {
      errorId: "err-005",
      correlationId: "msg-004",
      status: 404,
      code: "ERP_RECORD_NOT_FOUND",
      message: "No procurement or inventory record matched the requested part and purchase order.",
      source: "ORACLE_ERP",
      target: "INTEGRATION_LAYER",
      retryable: false,
      details: {
        purchaseOrderId: "PO-590133",
        partNumber: "PN-8842-A"
      }
    }
  },
  requestFinancialData: {
    title: "Financial Request Error",
    status: "400 Bad Request",
    sample: {
      errorId: "err-006",
      correlationId: "msg-006",
      status: 400,
      code: "INVALID_COST_OBJECT",
      message: "The cost object format is not valid for the finance lookup.",
      source: "INTEGRATION_LAYER",
      target: "WORKDAY",
      retryable: false,
      details: {
        costObject: "CO-44391",
        expectedPattern: "CO-[0-9]{5}"
      }
    }
  },
  financialData: {
    title: "Financial Data Error",
    status: "409 Conflict",
    sample: {
      errorId: "err-007",
      correlationId: "msg-006",
      status: 409,
      code: "FUNDING_STATUS_CONFLICT",
      message: "The project funding status changed while the transaction was being enriched.",
      source: "WORKDAY",
      target: "INTEGRATION_LAYER",
      retryable: true,
      details: {
        previousFundingStatus: "ACTIVE",
        currentFundingStatus: "ON_HOLD"
      }
    }
  },
  requestLegacyData: {
    title: "Legacy Request Error",
    status: "503 Service Unavailable",
    sample: {
      errorId: "err-008",
      correlationId: "msg-008",
      status: 503,
      code: "LEGACY_SOURCE_UNAVAILABLE",
      message: "PEDYN legacy data source is unavailable or not responding.",
      source: "INTEGRATION_LAYER",
      target: "PEDYN_LEGACY",
      retryable: true,
      details: {
        partNumber: "PN-8842-A",
        fallbackMode: "continue-without-legacy-history"
      }
    }
  },
  legacyData: {
    title: "Legacy Data Error",
    status: "422 Unprocessable Entity",
    sample: {
      errorId: "err-009",
      correlationId: "msg-008",
      status: 422,
      code: "LEGACY_FIELD_MAPPING_FAILED",
      message: "A legacy lab status value could not be mapped into the PICKS canonical payload.",
      source: "PEDYN_LEGACY",
      target: "INTEGRATION_LAYER",
      retryable: false,
      details: {
        field: "labStatus",
        sourceValue: "READY-UPD",
        expectedValues: ["READY_FOR_UPDATE", "BLOCKED", "COMPLETE"]
      }
    }
  },
  createUpdateRecord: {
    title: "MES Update Error",
    status: "409 Conflict",
    sample: {
      errorId: "err-010",
      correlationId: "msg-010",
      status: 409,
      code: "MES_RECORD_VERSION_CONFLICT",
      message: "The MES record was changed by another transaction before this update completed.",
      source: "MES_CANDIDATE",
      target: "INTEGRATION_LAYER",
      retryable: true,
      details: {
        mesRecordId: "MES-REC-55029",
        submittedVersion: 4,
        currentVersion: 5
      }
    }
  },
  statusConfirmation: {
    title: "Status Confirmation Error",
    status: "500 Internal Server Error",
    sample: {
      errorId: "err-011",
      correlationId: "msg-010",
      status: 500,
      code: "MES_STATUS_CONFIRMATION_FAILED",
      message: "MES accepted the update but failed to return a durable synchronization status.",
      source: "MES_CANDIDATE",
      target: "INTEGRATION_LAYER",
      retryable: true,
      details: {
        updateResult: "UNKNOWN",
        fallbackMode: "poll-status-endpoint"
      }
    }
  },
  logActivity: {
    title: "Audit Log Error",
    status: "503 Service Unavailable",
    sample: {
      errorId: "err-012",
      correlationId: "msg-012",
      status: 503,
      code: "AUDIT_SERVICE_UNAVAILABLE",
      message: "Audit service is temporarily unavailable; the integration event was queued for retry.",
      source: "INTEGRATION_LAYER",
      target: "RBAC_AUDIT_SERVICE",
      retryable: true,
      details: {
        transactionId: "txn-20260703-00042",
        queueName: "audit-event-retry",
        maxRetryMinutes: 30
      }
    }
  }
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function showPayloadModal(payload, mode) {
  if (!payload || !window.Swal) return;

  const json = JSON.stringify(payload.sample, null, 2);
  const label = mode === "error" ? "Sample error response" : "Technical API example";
  const meta = mode === "error" ? payload.status : payload.endpoint;
  const result = await Swal.fire({
    title: payload.title,
    html: `
      <div class="json-modal-meta">
        <span><i class="fa-solid ${mode === "error" ? "fa-triangle-exclamation" : "fa-link"}" aria-hidden="true"></i>${escapeHtml(label)}</span>
        <strong>${escapeHtml(meta)}</strong>
      </div>
      <pre class="json-modal-code ${mode === "error" ? "error-code" : ""}"><code>${escapeHtml(json)}</code></pre>
    `,
    width: "min(920px, 94vw)",
    confirmButtonText: "Close",
    showDenyButton: true,
    denyButtonText: "Copy JSON",
    customClass: {
      popup: "json-modal"
    }
  });

  if (result.isDenied && navigator.clipboard) {
    await navigator.clipboard.writeText(json);
    Swal.fire({
      title: "Copied",
      text: "Sample JSON copied to clipboard.",
      timer: 1100,
      showConfirmButton: false
    });
  }
}

document.querySelectorAll("[data-payload]").forEach((button) => {
  const errorButton = document.createElement("button");
  errorButton.className = "json-button error-button";
  errorButton.type = "button";
  errorButton.dataset.errorPayload = button.dataset.payload;
  errorButton.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>View Error Example';
  button.insertAdjacentElement("afterend", errorButton);

  button.addEventListener("click", () => {
    const payload = payloadSamples[button.dataset.payload];
    showPayloadModal(payload, "success");
  });

  errorButton.addEventListener("click", () => {
    const payload = payloadErrors[errorButton.dataset.errorPayload];
    showPayloadModal(payload, "error");
  });
});
